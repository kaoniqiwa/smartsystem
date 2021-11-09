export var EChartPieOption = {
  color: ["#3a93ff", "#ffba00", "#ef6464"],
  backgroundColor: "transparent",
  tooltip: {
    trigger: "item",
  },
  legend: {
    top: "5%",
    left: "center",
    show: false,
  },
  series: [
    {
      name: "",
      type: "pie",
      radius: ["76%", "90%"],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: "center",
      },
      emphasis: {
        label: {
          show: false,
          fontSize: "40",
          fontWeight: "bold",
        },
      },
      labelLine: {
        show: false,
      },
      data: [],
    },
    {
      name: "",
      type: "pie",
      radius: ["63%", "75%"],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: "center",
      },

      silent: true,
      emphasis: {
        label: {
          show: false,
          fontSize: "40",
          fontWeight: "bold",
        },
      },
      labelLine: {
        show: false,
      },
      data: new Array(),
      itemStyle: {
        opacity: 0.6,
      },
    },
    {
      name: "",
      type: "pie",
      radius: ["52%", "62%"],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: "center",
      },
      emphasis: {
        label: {
          show: false,
          fontSize: "40",
          fontWeight: "bold",
        },
      },
      labelLine: {
        show: false,
      },
      silent: true,
      data: [],
      itemStyle: {
        opacity: 0.3,
      },
    },
  ],
};
