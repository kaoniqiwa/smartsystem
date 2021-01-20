
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("underscore");
var xml2js = require("xml2js");
class HowellExcelV1 {

	constructor(data) {
		this.tplName = 'charts';
		this.zip = new JSZip();
		this.chart = data.chart || "bar";
		this.chartTitle = data.chartTitle;
		this.chartCatStrRef = data.chartCatStrRef;
		this.titles = data.titles;
		this.dataKey = data.dataKey;
		this.fields = data.fields;
		this.fieldName = data.fieldName;
		this.data = data.data;
		this.readZip = new JSZip();
	}
	write(opts) {
		var me = this;
		var builder = new xml2js.Builder();
		var xml = builder.buildObject(opts.object);
		me.zip.file(opts.file, xml, { base64: false });
	}

	read(opts, cb) {
 
		var t = this.zip.file(opts.file).asText();
		var parser = new xml2js.Parser({ explicitArray: false });
		parser.parseString(t, function (err, o) {
			if (err) {
				return new VError(err, "getXML");
			}
			cb(err, o);
		});
	}
	/*
	Get column name
*/
	getColName(n) {
		var abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		n--;
		if (n < 26) {
			return abc[n];
		} else {
			return abc[(n / 26 - 1) | 0] + abc[n % 26];
		}
	}
	/*
		Get shared string index
	*/
	getStr(s) {
		var me = this;
		if (!me.str.hasOwnProperty(s)) {
			//throw new VError ("getStr: Unknown string: " + s);
		}
		return me.str[s];
	}

	setRowCells(row, col) {
		const r = {
			$: {
				r: row.num,
				spans: row.spans
			}, c: new Array()
		};

		col.map(i => {
			if (i.t)
				r.c.push({
					$: {
						r: i.num,
						t: "s"
					},
					v: me.getStr(i.val)
				})
			else
				r.c.push({
					$: {
						r: i.num,
					},
					v: i.val
				});
		});
		return r;
	}

	writeRows(area,rows){
		var me = this;
		me.read({ file: "xl/worksheets/sheet2.xml" }, function (err, o) {
			o.worksheet.dimension.$.ref = area;
		});
		o.worksheet.sheetData.row = rows;
		me.write({ file: "xl/worksheets/sheet2.xml", object: o });
	}


	writeTable(cb) {
		var me = this;
		me.read({ file: "xl/worksheets/sheet2.xml" }, function (err, o) {
			if (err) {
				//return cb (new VError (err, "writeTable"));
			}
			o.worksheet.dimension.$.ref = "A1:" + me.getColName(me.titles.length + 1) + (me.fields.length + 2);
			var rows = [{
				$: {
					r: 1,
					spans: "1:" + (me.titles.length + 1)
				},
				c: _.map(me.titles, function (t, x) {
					return {
						$: {
							r: me.getColName(x + 2) + 1,
							t: "s"
						},
						v: me.getStr(t)
					}
				})
			}];
			_.each([me.fieldName[0]], function (f, y) {
				var r = {
					$: {
						r: y + 2,
						spans: "1:" + (me.titles.length + 1)
					}
				};
				var c = [{
					$: {
						r: "A" + (y + 2),
						t: "s"
					},
					v: me.getStr(f)
				}];
				c.push({
					$: {
						r: me.getColName(2) + 2
					},
					v: me.fieldName[1]
				});
				r.c = c;
				rows.push(r);
			});
			_.each(me.fields, function (f, y) {
				var r = {
					$: {
						r: y + 3,
						spans: "1:" + (me.titles.length + 1)
					}
				};
				var c = [{
					$: {
						r: "A" + (y + 3),
						t: "s"
					},
					v: me.getStr(f)
				}];
				_.each(me.dataKey, function (t, x) {

					c.push({
						$: {
							r: me.getColName(x + 3) + (y + 3)
						},
						v: me.data[t][f]
					});
				});

				r.c = c;
				rows.push(r);
			});
			o.worksheet.sheetData.row = rows;
			me.write({ file: "xl/worksheets/sheet2.xml", object: o });
		});
	}

	writeStrings(strs) {
		let me = this;

		me.read({ file: "xl/sharedStrings.xml" }, function (err, o) {
			if (err) {
				//return cb(new VError(err, "writeStrings"));
			}
			o.sst.$.count = strs.length;
			o.sst.$.uniqueCount = o.sst.$.count;

			let si = [];
			_.each(strs, function (t) {
				si.push({ t: t });
			});
			me.str = {};
			_.each(si, function (o, i) {
				me.str[o.t] = i;
			});
			o.sst.si = si;
			me.write({ file: "xl/sharedStrings.xml", object: o });
		});
	}

	setTemplateName() {
		var me = this;
		var charts = {};
		_.each(me.data, function (o) {
			charts[o.chart || me.chart] = true;
		});
		me.charts = charts;
		if (charts["radar"]) {
			me.tplName = "radar";
			return;
		};
		if (charts["scatter"]) {
			me.tplName = "scatter";
			return;
		};
		if (charts["pie"]) {
			me.tplName = "pie";
			return;
		};
		if (_.keys(charts).length == 1) {
			me.tplName = _.keys(charts)[0];
			return;
		};
		me.tplName = "charts";
	}

	writeChart(chartN, row, col, cb) {
		var me = this;

		me.read({ file: "xl/charts/chart1.xml" }, function (err, o) {
			if (err) {
				return cb(new VError(err, "writeChart"));
			}
			var ser = {};
			_.each(me.dataKey, function (t, i) {
				var chart = me.data[t].chart || me.chart;
				var r = {
					"c:idx": {
						$: {
							val: i
						}
					},
					"c:order": {
						$: {
							val: i
						}
					},
					"c:tx": {
						"c:strRef": {
						    "c:f": "Table!$" + me.getColName(i + col) + "$" + (row - 1), 
							//Table!$B$1  A2
							"c:strCache": {
								"c:ptCount": {
									$: {
										val: 1
									}
								},
								"c:pt": {
									$: {
										idx: 0
									},
									"c:v": t
								}
							}
						}
					},
					"c:cat": {
						"c:strRef": {
							"c:f": "Table!$"+me.chartCatStrRef+"$" + (row) + ":$"+me.chartCatStrRef+"$" + (me.fields.length + row - 1), // -1
							//Table!$A$2:$A$4  A3 A24
							"c:strCache": {
								"c:ptCount": {
									$: {
										val: me.fields.length
									}
								},
								"c:pt": _.map(me.fields, function (f, j) {
									return {
										$: {
											idx: j
										},
										"c:v": f
									};
								})
							}
						}
					},
					"c:val": {
						"c:numRef": {
							"c:f": "Table!$" + me.getColName(i + col + 1) + "$" + (row) + ":$" + me.getColName(i + col) + "$" + (me.fields.length + row - 1),
							//Table!$B$2:$B$4  B3 B24
							"c:numCache": {
								"c:formatCode": "General",
								"c:ptCount": {
									$: {
										val: me.fields.length
									}
								},
								"c:pt": _.map(me.fields, function (f, j) {
									return {
										$: {
											idx: j
										},
										"c:v": me.data[t][f]
									};
								})
							}
						}
					}
				};
				if (chart == "scatter") {
					r["c:xVal"] = r["c:cat"];
					delete r["c:cat"];
					r["c:yVal"] = r["c:val"];
					delete r["c:val"];
					r["c:spPr"] = {
						"a:ln": {
							$: {
								w: 28575
							},
							"a:noFill": ""
						}
					};
				};
				ser[chart] = ser[chart] || [];
				ser[chart].push(r);
			});   
			_.each(ser, function (ser, chart) {
				if (chart == "column") {
					if (me.tplName == "charts") {
						o["c:chartSpace"]["c:chart"]["c:plotArea"]["c:barChart"][0]["c:ser"] = ser;
					} else {
						o["c:chartSpace"]["c:chart"]["c:plotArea"]["c:barChart"]["c:ser"] = ser;
					};
				} else
					if (chart == "bar") {
						if (me.tplName == "charts") {
							o["c:chartSpace"]["c:chart"]["c:plotArea"]["c:barChart"]["c:ser"] = ser;
						} else {
							o["c:chartSpace"]["c:chart"]["c:plotArea"]["c:barChart"]["c:ser"] = ser;
						};
					} else {
						o["c:chartSpace"]["c:chart"]["c:plotArea"]["c:" + chart + "Chart"]["c:ser"] = ser;
					};
			});
			me.removeUnusedCharts(o);

			if (me.chartTitle) {
				me.writeTitle(o, me.chartTitle);
			};
			me.write({ file: `xl/charts/chart${chartN}.xml`, object: o });
			//cb ();
		});
	}

	writeChartV2(chartN, row, col, cb) {
		var me = this;

		me.read({ file: "xl/charts/chart1.xml" }, function (err, o) {
			if (err) {
				return cb(new VError(err, "writeChart"));
			}
			var ser = {};
			var column = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
			var i1 = 0;
			_.each(me.dataKey, function (t, i) {
				var chart = me.data[t].chart || me.chart;
				var r = {
					"c:idx": {
						$: {
							val: i
						}
					},
					"c:order": {
						$: {
							val: i
						}
					},
					"c:tx": {
						"c:strRef": {
							//	"c:f": "Table!$" + me.getColName(i + col) + "$" + row,
							"c:f": "Table!$" + column[i + 3] + "$2",//Table!$B$1  图表类别名
							"c:strCache": {
								"c:ptCount": {
									$: {
										val: 1
									}
								},
								"c:pt": {
									$: {
										idx: 0
									},
									"c:v": t
								}
							}
						}
					},
					"c:cat": {
						"c:strRef": {
							//	"c:f": "Table!$A$" + (row + 2) + ":$A$" + (me.fields.length + row),
							"c:f": "Table!$C$" + (row + 1) + ":$C$" + (me.fields.length + row),//Table!$A$2:$A$4
							"c:strCache": {
								"c:ptCount": {
									$: {
										val: me.fields.length
									}
								},
								"c:pt": _.map(me.fields, function (f, j) {
									return {
										$: {
											idx: j
										},
										"c:v": f
									};
								})
							}
						}
					},
					"c:val": {
						"c:numRef": {
							//	"c:f": "Table!$" + me.getColName(i + col) + "$" + (row + 2) + ":$" + me.getColName(i + col) + "$" + (me.fields.length + row),
							//Table!$B$2:$B$4
							"c:f": "Table!$" + me.getColName(i + col) + "$" + (row + 1) + ":$" + me.getColName(i + col) + "$" + (me.fields.length + row),
							"c:numCache": {
								"c:formatCode": "General",
								"c:ptCount": {
									$: {
										val: me.fields.length
									}
								},
								"c:pt": _.map(me.fields, function (f, j) {
									return {
										$: {
											idx: j
										},
										"c:v": me.data[t][f]
									};
								})
							}
						}
					}
				};
				if (chart == "scatter") {
					r["c:xVal"] = r["c:cat"];
					delete r["c:cat"];
					r["c:yVal"] = r["c:val"];
					delete r["c:val"];
					r["c:spPr"] = {
						"a:ln": {
							$: {
								w: 28575
							},
							"a:noFill": ""
						}
					};
				};
				ser[chart] = ser[chart] || [];
				ser[chart].push(r);
				//i+=1;
			});   
			_.each(ser, function (ser, chart) {
				if (chart == "column") {
					if (me.tplName == "charts") {
						o["c:chartSpace"]["c:chart"]["c:plotArea"]["c:barChart"][0]["c:ser"] = ser;
					} else {
						o["c:chartSpace"]["c:chart"]["c:plotArea"]["c:barChart"]["c:ser"] = ser;
					};
				} else
					if (chart == "bar") {
						if (me.tplName == "charts") {
							o["c:chartSpace"]["c:chart"]["c:plotArea"]["c:barChart"]["c:ser"] = ser;
						} else {
							o["c:chartSpace"]["c:chart"]["c:plotArea"]["c:barChart"]["c:ser"] = ser;
						};
					} else {
						o["c:chartSpace"]["c:chart"]["c:plotArea"]["c:" + chart + "Chart"]["c:ser"] = ser;
					};
			});
			me.removeUnusedCharts(o);

			if (me.chartTitle) {
				me.writeTitle(o, me.chartTitle);
			};
			me.write({ file: `xl/charts/chart${chartN}.xml`, object: o });
			//cb ();
		});
	}

	removeUnusedCharts(o) {
		var me = this;
		if (me.tplName != "charts") {
			return;
		};
		var axId = [];
		function addId(o) {
			_.each(o["c:axId"], function (o) {
				axId.push(o.$.val);
			});
		};
		_.each(["line", "radar", "area", "scatter", "pie"], function (chart) {
			if (!me.charts[chart]) {
				delete o["c:chartSpace"]["c:chart"]["c:plotArea"]["c:" + chart + "Chart"];
			} else {
				addId(o["c:chartSpace"]["c:chart"]["c:plotArea"]["c:" + chart + "Chart"]);
			};
		});
		if (!me.charts["column"] && !me.charts["bar"]) {
			delete o["c:chartSpace"]["c:chart"]["c:plotArea"]["c:barChart"];
		} else
			if (me.charts["column"] && !me.charts["bar"]) {
				o["c:chartSpace"]["c:chart"]["c:plotArea"]["c:barChart"] = o["c:chartSpace"]["c:chart"]["c:plotArea"]["c:barChart"][0];
				addId(o["c:chartSpace"]["c:chart"]["c:plotArea"]["c:barChart"]);
			} else
				if (!me.charts["column"] && me.charts["bar"]) {
					o["c:chartSpace"]["c:chart"]["c:plotArea"]["c:barChart"] = o["c:chartSpace"]["c:chart"]["c:plotArea"]["c:barChart"][1];
					addId(o["c:chartSpace"]["c:chart"]["c:plotArea"]["c:barChart"]);
				} else {
					addId(o["c:chartSpace"]["c:chart"]["c:plotArea"]["c:barChart"][0]);
					addId(o["c:chartSpace"]["c:chart"]["c:plotArea"]["c:barChart"][1]);
				};

		var catAx = [];
		_.each(o["c:chartSpace"]["c:chart"]["c:plotArea"]["c:catAx"], function (o) {
			if (axId.indexOf(o["c:axId"].$.val) > -1) {
				catAx.push(o);
			};
		});
		o["c:chartSpace"]["c:chart"]["c:plotArea"]["c:catAx"] = catAx;

		var valAx = [];
		_.each(o["c:chartSpace"]["c:chart"]["c:plotArea"]["c:valAx"], function (o) {
			if (axId.indexOf(o["c:axId"].$.val) > -1) {
				valAx.push(o);
			};
		});
		o["c:chartSpace"]["c:chart"]["c:plotArea"]["c:valAx"] = valAx;
	}
	/*
		Chart title
	*/
	writeTitle(chart, title) {
		var me = this;
		chart["c:chartSpace"]["c:chart"]["c:title"] = {
			"c:tx": {
				"c:rich": {
					"a:bodyPr": {},
					"a:lstStyle": {},
					"a:p": {
						"a:pPr": {
							"a:defRPr": {}
						},
						"a:r": {
							"a:rPr": {
								$: {
									lang: "ru-RU"
								}
							},
							"a:t": title
						}
					}
				}
			},
			"c:layout": {},
			"c:overlay": {
				$: {
					val: "0"
				}
			}
		};
		chart["c:chartSpace"]["c:chart"]["c:autoTitleDeleted"] = {
			$: {
				val: "0"
			}
		};
	}

	async loadZip(fileData) {
		await this.zip.load(fileData);

	}

	  

	async generate(fileData, writeName, row, col, v2Chart,replaceWorksheetAttr) {
		 
		let me = this, copyXml = (xmlFile,r) => { 
			var t = me.readZip.file(xmlFile).asText();
			var parser = new xml2js.Parser({ explicitArray: false });
			parser.parseString(t, function (err, o) {
				if (err) {
					return new VError(err, "getXML");
				}
			    if(r){ 
					o.worksheet.$=r.$;
					o.worksheet.drawing=r.drawing;
					o.worksheet.sheetViews=r.worksheet;
				}

				var builder = new xml2js.Builder();
				var xml = builder.buildObject(o);

				me.zip.file(xmlFile, xml, { base64: false });
			});
		}; 
			await	this.readZip.load(fileData) ;
			copyXml("xl/sharedStrings.xml");
			copyXml('xl/worksheets/sheet1.xml',replaceWorksheetAttr);
		this.setTemplateName();
		if (v2Chart)
			await me.writeChartV2(1, row, col);
		else await me.writeChart(1, row, col);
		setTimeout(() => {
			var result = me.zip.generate({ type: 'blob' });
			download(result, writeName + '.xlsx', "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
		}, 450);

	}

}

exports.HowellExcelV1 = HowellExcelV1;
