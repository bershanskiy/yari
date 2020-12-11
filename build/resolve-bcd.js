// Note! This is copied verbatim from stumptown-content

const bcd = require("@mdn/browser-compat-data");

function packageBCD(query) {
  let data = query.split(".").reduce((prev, curr) => {
    return prev && Object.prototype.hasOwnProperty.call(prev, curr)
      ? prev[curr]
      : undefined;
  }, bcd);
  return { browsers: bcd.browsers, data };
}

// This should be here to
let reverseMap;

function initReverseMap() {
  console.log("init");
  reverseMap = {};
  const stack = [
    {
      bcd: bcd,
      key: "",
    },
  ];

  while (stack.length) {
    const curr = stack.pop();
    if (typeof curr.bcd !== "object") continue;
    for (const key in curr.bcd) {
      if (key === "__compat") {
        let mdn_url = curr.bcd.__compat.mdn_url;
        if (!mdn_url) continue;
        // Remove leading "."
        const key = curr.key.slice(1);
        reverseMap[mdn_url] = key;
      } else {
        stack.push({
          bcd: curr.bcd[key],
          key: [curr.key, key].join("."),
        });
      }
    }
  }
}

function reverseBCD(mdn_url) {
  // Init reverseMap only if we use it
  reverseMap || initReverseMap();
  return reverseMap[mdn_url];
}

module.exports = {
  packageBCD,
  reverseBCD,
};
