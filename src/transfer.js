const LENGTH = [
    "em",
    "rem",
    "vh",
    "vw",
    "vmin",
    "vmax",
    "px",
    "cm",
    "mm",
    "in",
    "pt",
    "pc",
    "ch",
    "ex",
    "%",
  ];
  const BORDER_STYLE = [
    "none",
    "hidden",
    "dotted",
    "dashed",
    "solid",
    "double",
    "groove",
    "ridge",
    "inset",
    "outset",
  ];
  const BORDER_COLOR = ["currentColor", "transparent", "inherit"];
  const BORDER_GLOBAL = ["inherit", "initial", "unset"];  
  /**
   * 处理符合属性变成简单属性，这里可以加入各种处理插槽
   * @param property
   * @param value
   * @returns
   */
  module.exports.handleTransCompoundtoSingle = (
    property,
    value
  ) => {
    let returnValue = {};
    console.log('property', property)
    switch (property) {
      case "border":
        returnValue = handleBorderStyle(property, value);
        break;
      case "border-top":
        returnValue = handleBorderStyle(property, value);
        break;
      case "border-bottom":
        returnValue = handleBorderStyle(property, value);
        break;
      case "border-left":
        returnValue = handleBorderStyle(property, value);
        break;
      case "border-right":
        returnValue = handleBorderStyle(property, value);
        break;
      case "margin":
        returnValue = handleMarginorPaddingStyle(property, value);
        break;
      case "padding":
        returnValue = handleMarginorPaddingStyle(property, value);
        break;
      case "border-radius":
        returnValue = handleBorderRadiusStyle(property, value);
        break;
      case "background":
        returnValue = handleBackgroundStyle(property, value);
        break;
      case "color":
        returnValue = handleColorStyle(property, value);
        break;
      default:
        returnValue = {
          [property]: value,
        };
        break;
    }
    console.log('returnValue', returnValue)
    return returnValue;
  }
  
  function handleColorStyle(property, value) {
    const colorStyle = value.split(" ");
    if (colorStyle.length > 1 || !colorStyle[0].startsWith("#")) {
      return { [property]: value };
    }
    let returnValue = {};
    switch (value) {
      case "#ffffff":
        returnValue = {
          [property]: "#ffffff",
        };
        break;
      case "#000000":
        returnValue = {
          [property]: "#000000",
        };
        break;
      default:
        returnValue = {
          [property]: value,
        };
        break;
    }
    return returnValue;
  }
  
  function handleBackgroundStyle(
    property,
    value
  ) {
    const backgroundStyle = value.split(" ");
    if (backgroundStyle.length > 1 || !backgroundStyle[0].startsWith("#")) {
      return { [property]: value };
    }
    let returnValue = {};
    switch (value) {
      case "#ffffff":
        returnValue = {
          "background-color": "#fff",
        };
        break;
      case "#000000":
        returnValue = {
          "background-color": "#000",
        };
        break;
      default:
        returnValue = {
          "background-color": value,
        };
        break;
    }
    return returnValue;
  }
  
  // /* style */ border: solid;
  // /* Global values */ border: inherit | initial | unset;
  // /* width | style */ border: 2px dotted;
  // /* style | color */ border: outset #f33;
  // /* width | style | color */ border: medium dashed green;
  function handleBorderStyle(property, value) {
    const borderStyle = value.split(" ");
    let final = [];
    if (borderStyle.length > 3) {
      final = [borderStyle[0], borderStyle[1], borderStyle.slice(2).join(" ")];
    } else {
      final = [...borderStyle];
    }
    switch (final.length) {
      case 1:
        const [sg] = [final[0]];
        if (BORDER_STYLE.indexOf(sg) > -1) {
          return {
            [`${property}-style`]: sg,
          };
        } else if (BORDER_GLOBAL.indexOf(sg) > -1) {
          return {
            [property]: value,
          };
        } else {
          throw new Error(`${property}-style: ${value} is not a valid value`);
        }
      case 2:
        const [ws, sc] = [final[0], final[1]];
        if (BORDER_STYLE.indexOf(ws) > -1) {
          return {
            [`${property}-style`]: ws,
            [`${property}-color`]: sc,
          };
        } else if (BORDER_STYLE.indexOf(sc) > -1) {
          return {
            [`${property}-width`]: ws,
            [`${property}-style`]: sc,
          };
        } else {
          throw new Error(`${property}-style: ${value} is not a valid value`);
        }
      default:
        const [w, s, c] = [final[0], final[1], final[2]];
        if (BORDER_STYLE.indexOf(s) > -1) {
          return {
            [`${property}-width`]: w,
            [`${property}-style`]: s,
            [`${property}-color`]: c,
          };
        } else {
          throw new Error(`${property}-style: ${value} is not a valid value`);
        }
    }
  }
  
  // padding | margin: top | bottom, left | right
  // padding | margin: top, bottom, left, right
  // padding | margin: top, left | right, bottom
  function handleMarginorPaddingStyle(
    property,
    value
  ) {
    const marginStyle = value.split(" ");
    switch (marginStyle.length) {
      case 1:
        return {
          [property]: value,
        };
      case 2:
        const [tb2, lr2] = [marginStyle[0], marginStyle[1]];
        return {
          [`${property}-top`]: tb2,
          [`${property}-right`]: lr2,
          [`${property}-bottom`]: tb2,
          [`${property}-left`]: lr2,
        };
      case 3:
        const [t3, lr3, b3] = [marginStyle[0], marginStyle[1], marginStyle[2]];
        return {
          [`${property}-top`]: t3,
          [`${property}-right`]: lr3,
          [`${property}-bottom`]: b3,
          [`${property}-left`]: lr3,
        };
      default:
        const [t4, r4, b4, l4] = [
          marginStyle[0],
          marginStyle[1],
          marginStyle[2],
          marginStyle[3],
        ];
        return {
          [`${property}-top`]: t4,
          [`${property}-right`]: r4,
          [`${property}-bottom`]: b4,
          [`${property}-left`]: l4,
        };
    }
  }
  
  function handleBorderRadiusStyle(property, value) {
    const borderRadius = value.split(" ");
    switch (borderRadius.length) {
      case 1:
        return {
          [property]: value,
        };
      case 2:
        const [tl2br, tr2bl] = [borderRadius[0], borderRadius[1]];
        return {
          [`border-top-left-radius`]: tl2br,
          [`border-top-right-radius`]: tr2bl,
          [`border-bottom-left-radius`]: tr2bl,
          [`border-bottom-right-radius`]: tl2br,
        };
      case 3:
        const [tl, tr2bl3, br] = [
          borderRadius[0],
          borderRadius[1],
          borderRadius[2],
        ];
        return {
          [`border-top-left-radius`]: tl,
          [`border-top-right-radius`]: tr2bl3,
          [`border-bottom-left-radius`]: tr2bl3,
          [`border-bottom-right-radius`]: br,
        };
      default:
        const [t4, r4, b4, l4] = [
          borderRadius[0],
          borderRadius[1],
          borderRadius[2],
          borderRadius[3],
        ];
        return {
          [`border-top-left-radius`]: t4,
          [`border-top-right-radius`]: r4,
          [`border-bottom-right-radius`]: b4,
          [`border-bottom-left-radius`]: l4,
        };
    }
  }
  