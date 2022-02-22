let taskSerie = {
  type: "gauge",
  startAngle: 90,
  endAngle: -270,
  radius: "90%",
  pointer: {
    show: false,
  },
  progress: {
    show: true,
    overlap: false,
    roundCap: false,
    clip: false,
    itemStyle: {
      borderWidth: 0,
      color: "#3a93ff",
    },
  },
  axisLine: {
    lineStyle: {
      width: 10,
      color: [[1, "#4b5899"]],
      opacity: 0.5,
    },
  },
  splitLine: {
    show: false,
    distance: 0,
    length: 10,
  },
  axisTick: {
    show: false,
  },
  axisLabel: {
    show: false,
  },
  data: [
    {
      value: 100,
      name: "处置率",
      title: {
        offsetCenter: ["0%", "-10%"],
      },
      detail: {
        offsetCenter: ["0%", "-42%"],
      },
    },
  ],
  title: {
    fontSize: 14,
    color: "#868fff",
  },
  detail: {
    width: 50,
    height: 14,
    color: "auto",
    rich: {
      a: {
        color: "white",
        fontSize: 28,
        fontWeight: "normal",
      },
      b: {
        fontSize: 12,
        color: "#cfd7ff",
        // verticalAlign: "bottom",
      },
    },
    formatter: (value) => {
      return "{a|" + value + "}{b|%}";
    },
  },
};
let timeoutSerie = {
  type: "gauge",
  startAngle: 90,
  endAngle: -270,
  radius: "80%",
  pointer: {
    show: false,
  },
  progress: {
    show: true,
    overlap: false,
    roundCap: false,
    clip: false,
    itemStyle: {
      borderWidth: 0,
      color: "#ffba00",
    },
  },
  axisLine: {
    lineStyle: {
      width: 10,
      color: [[1, "#4b5899"]],
      opacity: 0.3,
    },
  },
  splitLine: {
    show: false,
    distance: 0,
    length: 10,
  },
  axisTick: {
    show: false,
  },
  axisLabel: {
    show: false,
  },
  data: [
    {
      value: 0,
      name: "超时率",
      title: {
        offsetCenter: ["0%", "55%"],
      },
      detail: {
        offsetCenter: ["0%", "18%"],
      },
    },
  ],
  title: {
    fontSize: 14,
    color: "#ffba00",
  },
  detail: {
    width: 50,
    height: 14,
    color: "auto",
    rich: {
      a: {
        color: "white",
        fontSize: 28,
        fontWeight: "normal",
      },
      b: {
        fontSize: 12,
        color: "#cfd7ff",
        fontFamily: "微软雅黑",
      },
    },
    formatter: (value) => {
      return "{a|" + value + "}{b|%}";
    },
  },
};
export let StatisticSummaryTaskChartOption = {
  color: ["#3a93ff"],
  backgroundColor: "transparent",
  series: [taskSerie, timeoutSerie],
};
