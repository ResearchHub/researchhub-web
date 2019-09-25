const colors = {
  BLUE: opacity => `rgba(78, 83, 255, ${opacity})`,
  PURPLE: opacity => `rgba(36, 31, 58, ${opacity})`,
  GREY: opacity => `rgba(193, 193, 207, ${opacity})`,
  LIGHT_GREY: opacity => `rgba(242, 242, 246, ${opacity})`,
  GREEN: opacity => `rgba(30, 207, 49, ${opacity})`,
  LIGHT_GREEN: opacity => this.GREEN(0.1),
  LIGHT_BLUE: opacity => this.BLUE(0.1),
  ORANGE: opacity => `rgba(255, 109, 0, ${opacity})`,
  RED: opacity => `rgba(255, 45, 45, ${opacity})`
};
