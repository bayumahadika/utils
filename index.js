/// VALIDATOR
exports.isValidURL = (url) => {
  const urlPattern =
    /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(:\d{2,5})?(\/[^\s]*)?$/i;
  return urlPattern.test(url);
};
exports.isValidTikTokURL = (url) => {
  const tiktokPattern =
    /^(https?:\/\/)?(www\.)?(tiktok\.com\/(@[\w.-]+|t\/[\w-]+|[^/]+\/video\/\d+)|vt\.tiktok\.com\/[\w-]+)\/?$/;
  return tiktokPattern.test(url);
};
exports.isValidYouTubeURL = (url) => {
  const youtubePattern =
    /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=[\w-]+|shorts\/[\w-]+|embed\/[\w-]+)|youtu\.be\/[\w-]+)/;
  return youtubePattern.test(url);
};
/// END VALIDATOR

/// GENERATOR
exports.generateRandomString = (size) => {
  return require("crypto").randomBytes(size).toString("hex");
};
exports.generateRandomText = (length) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
};
/// END GENERATOR

/// FORMMATER
exports.formatCurrency = (amount, locale = "id", currency = "idr") => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  }).format(parseInt(amount));
};
exports.formatTime = (date, locale = "id", timezone = "Asia/Jakarta") => {
  return new Intl.DateTimeFormat(locale, {
    timeZone: timezone,
    hourCycle: "h23",
    second: "2-digit",
    minute: "2-digit",
    hour: "2-digit",
  }).format(date);
};
exports.formatDate = (date, locale = "id", timezone = "Asia/Jakarta") => {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: timezone,
  }).format(date);
};
exports.formatDateTime = (date, locale = "id", timezone = "Asia/Jakarta") => {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: timezone,
    hourCycle: "h23",
    second: "2-digit",
    minute: "2-digit",
    hour: "2-digit",
  }).format(date);
};
exports.toCapitalize = (str) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};
exports.groupByProperty = (propertyName, arrayData) =>
  new Promise((resolve) => {
    const datas = [];
    for (let data of arrayData) {
      const property = datas.find(
        (d) => d[propertyName] === data[propertyName],
      );
      if (!property) {
        datas.push({
          [propertyName]: data[propertyName],
          data: [data],
        });
      } else {
        property.data.push(data);
      }
    }
    resolve(datas);
  });

exports.paginateData = (arrayData, page = 1, size = 10) => {
  return new Promise((resolve) => {
    if (isNaN(page) || page < 1) page = 1;
    const totalPages = Math.ceil(arrayData.length / size);
    const next = page < totalPages;
    const prev = page > 1;
    if (page > totalPages) {
      resolve({
        totalData: arrayData.length,
        totalPages,
        currentPage: page,
        next,
        prev,
        data: arrayData.slice(0, parseInt(size || 10)),
      });
    }
    const startIndex = (page - 1) * parseInt(size);
    const endIndex = startIndex + parseInt(size);
    const data = arrayData.slice(startIndex, endIndex);
    resolve({
      totalData: arrayData.length,
      totalPages,
      currentPage: page,
      size,
      next,
      prev,
      data,
    });
  });
};
/// END FORMATTER

/// OTHER
exports.blobToBuffer = async (blob) => {
  return Buffer.from(await blob.toArrayBuffer());
};
exports.streamToBuffer = (stream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
};
exports.bufferToStream = (buffer) => {
  const { Readable } = require("stream");
  return new Promise((resolve) => {
    const stream = new Readable({
      read() {
        this.push(buffer);
        this.push(null);
      },
    });
    resolve(stream);
  });
};
exports.getBuffer = async (url) => {
  const fetch = require("node-fetch");
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  return Buffer.from(buffer);
};
exports.sleep = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

exports.execPromise = (command) => {
  const { exec } = require("child_process");
  return new Promise((resolve, reject) =>
    exec(command, (err, stdout, stderr) => {
      if (err) reject(err || stderr);
      else resolve(stdout || stderr);
    }),
  );
};
exports.spawnPromise = (command, args) => {
  return new Promise((resolve, reject) => {
    const { spawn } = require("child_process");
    const process = spawn(command, args);
    let data = "";
    let error = "";
    process.stdout.on("data", (chunk) => {
      data = chunk.toString();
    });
    process.stderr.on("data", (chunk) => {
      error = chunk.toString();
    });
    process.on("error", reject);
    process.on("close", (code) => {
      if (code == 0) {
        resolve(data);
      } else {
        reject(new Error(error));
      }
    });
  });
};
exports.question = (text) => {
  const readline = require("readline");
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(text, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
};
const dataLimitter = [];
exports.rateLimitter = (id, limit = 5, duration = 1000 * 60) => {
  let data = dataLimitter.find((val) => val.id === id);
  const now = Date.now();
  if (!data) {
    data = {
      id,
      req: [now],
    };
    dataLimitter.push(limit);
  }
  data.req.filter((req) => req + duration >= now);
  data.req.push(now);
  return data.req.length > limit;
};
exports.clearConsole = () => process.stdout.write("\x1B[2J\x1B[3J\x1B[H\x1Bc");
