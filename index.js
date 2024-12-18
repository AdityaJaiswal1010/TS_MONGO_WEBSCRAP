"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb_1 = require("mongodb");
var uuid_1 = require("uuid");
var dotenv = require("dotenv");
dotenv.config();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var uri, client, db, collection, uuids, i, batch, uuidDocs, charCountMap, _i, uuidDocs_1, doc, charCount, key, totalSharedCounts, uniqueProfiles, averageSharedCount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    uri = process.env.DB_URL;
                    if (!uri) {
                        throw new Error("DB_URL environment variable is not defined!");
                    }
                    client = new mongodb_1.MongoClient(uri);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 8, 10]);
                    return [4 /*yield*/, client.connect()];
                case 2:
                    _a.sent();
                    console.log("Connected to MongoDB");
                    db = client.db("test");
                    collection = db.collection("uuid");
                    // Insert 100,000 UUIDs into the collection
                    console.log("Inserting 100,000 UUIDs...");
                    uuids = Array.from({ length: 100000 }, function () { return ({ _id: (0, uuid_1.v4)() }); });
                    i = 0;
                    _a.label = 3;
                case 3:
                    if (!(i < uuids.length)) return [3 /*break*/, 6];
                    batch = uuids.slice(i, i + 1000);
                    return [4 /*yield*/, collection.insertMany(batch)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    i += 1000;
                    return [3 /*break*/, 3];
                case 6:
                    console.log("UUIDs inserted.");
                    // Analyze UUIDs for per-character counts
                    console.log("Analyzing UUIDs...");
                    return [4 /*yield*/, collection.find().toArray()];
                case 7:
                    uuidDocs = _a.sent();
                    charCountMap = new Map();
                    for (_i = 0, uuidDocs_1 = uuidDocs; _i < uuidDocs_1.length; _i++) {
                        doc = uuidDocs_1[_i];
                        charCount = getCharacterCount(doc._id);
                        key = JSON.stringify(charCount);
                        charCountMap.set(key, (charCountMap.get(key) || 0) + 1);
                    }
                    totalSharedCounts = Array.from(charCountMap.values()).reduce(function (a, b) { return a + b; }, 0);
                    uniqueProfiles = charCountMap.size;
                    averageSharedCount = totalSharedCounts / uniqueProfiles;
                    console.log("Total number of UUIDs sharing the same per-character counts: ".concat(totalSharedCounts));
                    console.log("Average number of UUIDs sharing the same per-character counts: ".concat(averageSharedCount));
                    return [3 /*break*/, 10];
                case 8: return [4 /*yield*/, client.close()];
                case 9:
                    _a.sent();
                    console.log("Connection to MongoDB closed.");
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    });
}
function getCharacterCount(uuid) {
    var charCount = {};
    for (var _i = 0, _a = uuid.replace(/-/g, ""); _i < _a.length; _i++) { // Remove hyphens for accurate counts
        var char = _a[_i];
        charCount[char] = (charCount[char] || 0) + 1;
    }
    return charCount;
}
main().catch(console.error);
