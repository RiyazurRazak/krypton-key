# Authors: Riyazur Razak, Ragul R, Saran VT
# Created: September 2022


import json
import sys
import requests


MIN_THRESHOLD = 8
MAX_THRESHOLD = 13


class Parser:
    def __init__(self) -> None:
        self.__min_length: int = 0
        self.__max_length: int = sys.maxsize
        self.__is_upper_case: bool = True
        self.__is_lower_case: bool = True
        self.__is_digit: bool = True
        self.__allowed_characters: list = [
            '!', '@', '#', "$", '%', "^", "&", "*", "(", "-"]
        self.__rules_count = 0
        self.__exclude_count = 0

    def parse(self, rules: list[str]) -> None:
        self.__rules_count += 1
        is_excluded_early: bool = False
        for rule in rules:
            pack_rule_set = rule.split(":")
            if pack_rule_set[0].strip() == "minlength":
                if (int(pack_rule_set[1]) <= MIN_THRESHOLD):
                    self.__min_length = max(
                        self.__min_length, int(pack_rule_set[1]))
                else:
                    self.__exclude_count += 1
                    is_excluded_early = True
            elif pack_rule_set[0].strip() == "maxlength" and is_excluded_early == False:
                if int(pack_rule_set[1]) >= MAX_THRESHOLD:
                    self.__max_length = min(
                        self.__max_length, int(pack_rule_set[1]))
                else:
                    self.__exclude_count += 1
            is_excluded_early = False

    def result(self) -> None:
        print("""
        -------------------- Password Rule Analyzer --------------------
        """)
        print("Minimum Length : " + str(self.__min_length), end="\n")
        print("Maximum Length : " + str(self.__max_length), end="\n")
        print("Contains Upper Case : " + str(self.__is_upper_case), end="\n")
        print("Contains Lower Case : " + str(self.__is_lower_case), end="\n")
        print("Contains Digits : " + str(self.__is_digit), end="\n")
        print("Allowed Special Characters : " +
              str(self.__allowed_characters), end="\n\n")
        print("Analyzed using total of " + str(int(self.__rules_count)) +
              " password rule sets from the open-source repository")
        print("Total Websites Excluded From Analyzing or False data Found : " +
              str(self.__exclude_count), end="\n")
        print("Supported websites for the above password rule : " +
              str(int(self.__rules_count) - int(self.__exclude_count)) + " / " + str(self.__rules_count))
        print("""
        ----------------------------------------------------------------
        """)


parser = Parser()


response: requests.Response = requests.get(
    "https://raw.githubusercontent.com/apple/password-manager-resources/main/quirks/password-rules.json")
json_data: str = response.text
password_rules: dict = json.loads(json_data)


for raw_rules in password_rules.values():
    rule: str = raw_rules["password-rules"]
    rules: list = rule.split(";")
    parser.parse(rules)


parser.result()
