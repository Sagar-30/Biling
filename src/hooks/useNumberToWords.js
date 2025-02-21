import numberToWords from "number-to-words";

const englishToMarathi = {
    one: "एक",
    two: "दोन",
    three: "तीन",
    four: "चार",
    five: "पाच",
    six: "सहा",
    seven: "सात",
    eight: "आठ",
    nine: "नऊ",
    ten: "दहा",
    eleven: "अकरा",
    twelve: "बारा",
    thirteen: "तेरा",
    fourteen: "चौदा",
    fifteen: "पंधरा",
    sixteen: "सोळा",
    seventeen: "सतरा",
    eighteen: "अठरा",
    nineteen: "एकोणीस",
    twenty: "वीस",
    thirty: "तीस",
    forty: "चाळीस",
    fifty: "पन्नास",
    sixty: "साठ",
    seventy: "सत्तर",
    eighty: "ऐंशी",
    ninety: "नव्वद",
    hundred: "शंभर",
    thousand: "हजार",
    lakh: "लाख",
    million: "लाख",
    billion: "अब्ज",
    crore: "कोटी"
};

export default function convertNumberToMarathi(num) {
    const words = numberToWords.toWords(num).replace("million", "लाख");
    let marathiWords = words.split(" ").map(word => englishToMarathi[word] || word).join(" ");
    return marathiWords;
};