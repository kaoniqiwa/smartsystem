export var EChartLineOption = {
  backgroundColor: "transparent",
  title: {
    text: "乱扔垃圾统计表",
    textStyle: {
      color: "#fff",
      fontSize: "24px",
      fontFamily: "Source Han Sans CN Normal",
      fontWeight: 400,
      overflow: "truncate",
      width: 428,
    },
    top: 0,
  },
  legend: {
    selectedMode: false,
    top: "12px",
    right: "0px",
    icon: "none",
    data: ["单位(起)"],
    textStyle: {
      color: "#7a8de6",
      fontSize: "12px",
    },
    show: true,
  },
  tooltip: {
    mainType: "tooltip",
    trigger: "axis",
    axisPointer: {
      type: "cross",
      label: {
        show: true,
      },
    },
  },
  grid: {
    left: 15,
    right: 15,
    bottom: 0,
    containLabel: true,
  },
  xAxis: {
    type: "category",
    data: [],
    axisLine: {
      onZero: false,
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      color: "#CFD7FE",
      fontSize: 16,
    },
  },
  yAxis: {
    type: "value",
    axisTick: {
      show: false,
    },
    axisLine: {
      show: false,
    },
    axisLabel: {
      show: false,
    },
    splitLine: {
      lineStyle: {
        color: "rgb(117,134,224,0.3)",
      },
    },
  },
  series: [
    {
      type: "line",
      name: "单位(起)",
      data: [],
      areaStyle: {},
      lineStyle: {
        width: 4,
        color: "#7586e0",
      },
      itemStyle: {
        color: "#7586e0",
      },
      label: {
        show: true,
        color: "#fff",
        fontSize: 16,
      },
    },
  ],
};
