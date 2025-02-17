/**
 * @jest-environment jsdom
 */

import { checkSpelling, setupApp } from "./script.js"; // Import ES module

jest.mock('./words.json', () => (['hello', 'world']), { virtual: true });

describe("checkSpelling", () => {
    let checkBtn;

    beforeEach(() => {
        global.localStorage = {
            getItem: jest.fn().mockReturnValue(JSON.stringify([])),
            setItem: jest.fn(),
        };

        // Set up the DOM before each test
        document.body.innerHTML = `
            <textarea id="user-input"></textarea>
            <button id="check-btn">Check</button>
            <div id="misspelled"></div>
        `;

        // Add a small delay before initializing the app to ensure the DOM is ready
        setTimeout(() => {
            checkBtn = document.getElementById('check-btn');
            setupApp();
        }, 0);
    });

    afterEach(() => {
        // Clean up after each test to avoid conflicts
        jest.clearAllMocks();
    });

    test("should return an empty array if all words are spelled correctly", () => {
        expect(checkSpelling("hello world")).toEqual([]);
    });

    test("should return misspelled words", () => {
        expect(checkSpelling("helo wrld")).toEqual(["helo", "wrld"]);
    });

    test("should ignore capitalized words", () => {
        expect(checkSpelling("Hello World")).toEqual([]);
    });

    test("should handle punctuation correctly", () => {
        expect(checkSpelling("helo, wrld!")).toEqual(["helo", "wrld"]);
    });

    test("should handle worlds adjacent to special characters", () => {
        expect(checkSpelling("hello, world! this is a test.")).toEqual(['this', 'is', 'a', 'test']);
    })

    test("should correctly handle hyphenated words", () => {
        expect(checkSpelling("hyphenated-word")).toEqual(["hyphenated-word"]);
        expect(checkSpelling("hyphenated-wrld")).toEqual(["hyphenated-wrld"]);
        expect(checkSpelling("wrong-hyphen-word")).toEqual(["wrong-hyphen-word"]);
    });

    test("should return multiple misspelled words", () => {
        expect(checkSpelling("helo wrld hyphenated-wrld")).toEqual(["helo", "wrld", "hyphenated-wrld"]);
    });

    test("should return an empty array when input is empty", () => {
        expect(checkSpelling("")).toEqual([]);
    });

    test("should handle words with numbers and symbols", () => {
        expect(checkSpelling("hello123 world!")).toEqual(["hello123"]);
    });
});
