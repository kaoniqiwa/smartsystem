export var StatisticSummaryTaskChartOption = {
  color: ["#3a93ff"],
  backgroundColor: "transparent",
  series: [
    {
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
          borderWidth: 8,
          borderColor: "#3a93ff",
        },
      },
      axisLine: {
        lineStyle: {
          width: 5,
          color: [[1, "#6b7199"]],
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
            offsetCenter: ["0%", "30%"],
          },
          detail: {
            offsetCenter: ["0%", "-20%"],
          },
        },
      ],
      title: {
        fontSize: 16,
        color: "#868fff",
      },
      detail: {
        width: 50,
        height: 14,
        fontSize: 50,
        color: "auto",
        rich: {
          a: {
            color: "white",
            fontSize: 40,
            fontWeight: "normal",
          },
          b: {
            fontSize: 14,
            color: "#cfd7ff",
            verticalAlign: "bottom",
          },
        },
        valueAnimation: true,
        formatter: function (value) {
          return "{a|" + value + "}{b|%}";
        },
      },
    },
  ],
};
