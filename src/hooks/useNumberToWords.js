import numberToWords from "number-to-words";

const englishToMarathi = {
    "one": "एक", "two": "दोन", "three": "तीन", "four": "चार", "five": "पाच",
    "six": "सहा", "seven": "सात", "eight": "आठ", "nine": "नऊ", "ten": "दहा",
    "eleven": "अकरा", "twelve": "बारा", "thirteen": "तेरा", "fourteen": "चौदा",
    "fifteen": "पंधरा", "sixteen": "सोळा", "seventeen": "सतरा", "eighteen": "अठरा",
    "nineteen": "एकोणीस", "twenty": "वीस", "twenty-one": "एकवीस", "twenty-two": "बावीस",
    "twenty-three": "तेवीस", "twenty-four": "चोवीस", "twenty-five": "पंचवीस",
    "twenty-six": "सव्वीस", "twenty-seven": "सत्तावीस", "twenty-eight": "अठ्ठावीस",
    "twenty-nine": "एकोणतीस", "thirty": "तीस", "thirty-one": "एकतीस", "thirty-two": "बत्तीस",
    "thirty-three": "तेहेतीस", "thirty-four": "चौतीस", "thirty-five": "पस्तीस",
    "thirty-six": "छत्तीस", "thirty-seven": "सदतीस", "thirty-eight": "अडतीस",
    "thirty-nine": "एकोणचाळीस", "forty": "चाळीस", "forty-one": "एक्केचाळीस",
    "forty-two": "बेचाळीस", "forty-three": "त्रेचाळीस", "forty-four": "चव्वेचाळीस",
    "forty-five": "पंचेचाळीस", "forty-six": "सेहेचाळीस", "forty-seven": "सत्तेचाळीस",
    "forty-eight": "अठ्ठेचाळीस", "forty-nine": "एकोणपन्नास", "fifty": "पन्नास",
    "fifty-one": "एक्कावन्न", "fifty-two": "बावन्न", "fifty-three": "त्रेपन्न",
    "fifty-four": "चोपन्न", "fifty-five": "पंचावन्न", "fifty-six": "छप्पन्न",
    "fifty-seven": "सत्तावन्न", "fifty-eight": "अठ्ठावन्न", "fifty-nine": "एकोणसाठ",
    "sixty": "साठ", "sixty-one": "एकसष्ट", "sixty-two": "बासष्ट", "sixty-three": "त्रेसष्ट",
    "sixty-four": "चौसष्ट", "sixty-five": "पासष्ट", "sixty-six": "सहासष्ट",
    "sixty-seven": "सदुसष्ट", "sixty-eight": "अडुसष्ट", "sixty-nine": "एकोणसत्तर",
    "seventy": "सत्तर", "seventy-one": "एक्काहत्तर", "seventy-two": "बाहत्तर",
    "seventy-three": "त्र्याहत्तर", "seventy-four": "चौर्‍याहत्तर", "seventy-five": "पंच्याहत्तर",
    "seventy-six": "शहात्तर", "seventy-seven": "सत्याहत्तर", "seventy-eight": "अठ्ठ्याहत्तर",
    "seventy-nine": "एकोणऐंशी", "eighty": "ऐंशी", "eighty-one": "एक्क्याऐंशी",
    "eighty-two": "ब्याऐंशी", "eighty-three": "त्र्याऐंशी", "eighty-four": "चौर्याऐंशी",
    "eighty-five": "पंच्याऐंशी", "eighty-six": "शहाऐंशी", "eighty-seven": "सत्त्याऐंशी",
    "eighty-eight": "अठ्ठ्याऐंशी", "eighty-nine": "एकोणनव्वद", "ninety": "नव्वद",
    "ninety-one": "एक्क्याण्णव", "ninety-two": "ब्याण्णव", "ninety-three": "त्र्याण्णव",
    "ninety-four": "चौर्याण्णव", "ninety-five": "पंच्याण्णव", "ninety-six": "शहाण्णव",
    "ninety-seven": "सत्त्याण्णव", "ninety-eight": "अठ्ठ्याण्णव", "ninety-nine": "नव्व्याण्णव",
    "hundred": "शंभर", "thousand": "हजार", "lakh": "लाख", "million": "लाख",
    "crore": "कोटी", "billion": "अब्ज"
};

const fixMarathiNumberFormat = (marathiStr) => {
    return marathiStr.replace(/एक शंभर पन्नास/g, "एकशे पन्नास")
        .replace(/दोन शंभर पन्नास/g, "दोनशे पन्नास")
        .replace(/तीन शंभर पन्नास/g, "तीनशे पन्नास")
        .replace(/चार शंभर पन्नास/g, "चारशे पन्नास")
        .replace(/पाच शंभर पन्नास/g, "पाचशे पन्नास")
        .replace(/सहा शंभर पन्नास/g, "सहाशे पन्नास")
        .replace(/सात शंभर पन्नास/g, "सातशे पन्नास")
        .replace(/आठ शंभर पन्नास/g, "आठशे पन्नास")
        .replace(/नऊ शंभर पन्नास/g, "नऊशे पन्नास")
        .replace(/चार शंभर/g, "चारशे")
        .replace(/दोन शंभर/g, "दोनशे")
        .replace(/तीन शंभर/g, "तीनशे")
        .replace(/पाच शंभर/g, "पाचशे")
        .replace(/सहा शंभर/g, "सहाशे")
        .replace(/सात शंभर/g, "सातशे")
        .replace(/आठ शंभर/g, "आठशे")
        .replace(/नऊ शंभर/g, "नऊशे");
};

//एक शंभर पन्नास 

export default function convertNumberToMarathi(num) {

    let words = numberToWords.toWords(num);


    let marathiWords = words.split(" ").map(word => {

        let punctuation = "";
        if (/[,.]$/.test(word)) {
            punctuation = word.slice(-1);
            word = word.slice(0, -1);
        }
        return (englishToMarathi[word] || word) + punctuation;
    }).join(" ");

    return fixMarathiNumberFormat(marathiWords);
}