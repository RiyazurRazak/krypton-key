// ---------------------------------------------------------
// FileName: krypton-key.ino
// FileType: Krypron key source file (Pro Micro)
// Author: Riyazur Razak, Ragul, Saran
// Created On: September 2022
// ---------------------------------------------------------

#include "krypton-key.h"

byte salt[16] = {57, 107, 104, 103, 97, 79, 110, 86, 97, 117, 78, 114, 52, 102, 108, 65};
unsigned char END_SYMBOL = '|';

DFRobot_ID809_I2C fingerprint;
AES128 aes128;

void setup()
{
    Serial.begin(BAUD_RATE);
    Keyboard.begin();
    fingerprint.begin();
    aes128.setKey(salt, 16);
    while (fingerprint.isConnected() == false)
    {
        Serial.println(String(INFO) + String(":Waiting for fingerprint sensor to connect..."));
        delay(1000);
    }
}

void loop()
{

    while (Serial.available() > 0)
    {
        String command = Serial.readString();
        parseCommand(command);
    }

    uint8_t ret = 0;
    if ((fingerprint.collectionFingerprint(5)) != ERR_ID809)
    {
        fingerprint.ctrlLED(fingerprint.eFastBlink, fingerprint.eLEDCyan, 3);
        while (fingerprint.detectFinger())
            ;
        ret = fingerprint.search();
        if (ret != 0)
        {
            char fingerId = (char)ret;
            readMemory(fingerId);
        }
        else
        {
            fingerprint.ctrlLED(fingerprint.eFastBlink, fingerprint.eLEDRed, 3);
        }
    }
}

void readMemory(unsigned char blockAddress)
{
    char data[100];
    int startIndex = 2034;
    int ID = blockAddress;
    int prevValue = EEPROM.read(0);
    for (int i = 0; i < EEPROM.length(); i++)
    {
        if (i != 0)
        {
            prevValue = EEPROM.read(i - 1);
        }
        int value = EEPROM.read(i);
        if (value == ID && i == 0)
        {
            startIndex = i;
            break;
        }
        if (value == ID && prevValue == 124)
        {
            startIndex = i;
            break;
        }
    }
    if (startIndex != 2034)
    {
        startIndex++;
        int idx = 0;
        while (EEPROM[startIndex] != 124)
        {
            data[idx++] = EEPROM[startIndex++];
        }
        String encryptedText = String(data);
        byte buffer[encryptedText.length()];
        byte decrypt[encryptedText.length()];
        encryptedText.getBytes(buffer, encryptedText.length());
        aes128.decryptBlock(decrypt, buffer);
        String decryptPassword = String((char *)decrypt);
        Serial.println(String(decryptPassword));
        Keyboard.print(decryptPassword);
        fingerprint.ctrlLED(fingerprint.eFastBlink, fingerprint.eLEDGreen, 3);
    }
    else
    {
        fingerprint.ctrlLED(fingerprint.eFastBlink, fingerprint.eLEDRed, 2);
    }
}

int getMemoryIndex()
{
    int index = 0, nextIndex = 1;
    unsigned char pointer = EEPROM.read(index);
    unsigned char nextPointer = EEPROM.read(index);
    while (index < (EEPROM.length() - 1))
    {
        pointer = EEPROM.read(index);
        nextPointer = EEPROM.read(nextIndex);
        nextIndex++;
        index++;
        if (pointer == END_SYMBOL && nextPointer == 0)
            break;
    }
    if (index == (EEPROM.length() - 1))
        return 0;
    return index;
}

void storeInMemory(String message)
{
    int memoryIdx = getMemoryIndex();
    char identifier = message[0];
    int ID = identifier - '0';
    String password = message.substring(1);
    byte buffer[password.length()];
    byte cypherPassword[password.length()];
    byte decrypt[password.length()];
    password.getBytes(buffer, password.length());
    aes128.encryptBlock(cypherPassword, buffer);
    String encryptedText = String((char *)cypherPassword);
    int _size = encryptedText.length();
    EEPROM.write(memoryIdx, ID);
    memoryIdx++;
    for (int i = 0; i < _size; i++)
    {
        EEPROM.write(i + memoryIdx, encryptedText[i]);
    }
    EEPROM.write(_size + memoryIdx, '|');
    Serial.println(String(RECIEVE_PASSWORD) + String(":SUCCESS"));
    fingerprint.ctrlLED(fingerprint.eKeepsOn, fingerprint.eLEDGreen, 3);
    delay(1000);
    fingerprint.ctrlLED(fingerprint.eNormalClose, fingerprint.eLEDBlue, 0);
    delay(1000);
}

void addFingerprint()
{
    uint8_t ID, i, ret;
    if ((ID = fingerprint.getEmptyID()) == ERR_ID809)
    {
        while (1)
        {
            delay(1000);
        }
    }
    i = 0;
    while (i < 3)
    {
        fingerprint.ctrlLED(fingerprint.eBreathing, fingerprint.eLEDMagenta, 0);
        Serial.println(String(INFO) + String(":Please press down your finger on the sensor\n"));
        if ((fingerprint.collectionFingerprint(10)) != ERR_ID809)
        {
            fingerprint.ctrlLED(fingerprint.eFastBlink, fingerprint.eLEDBlue, 3);
            i++;
        }
        else
        {
            Serial.println(String(ERROR) + String(":Failed To Capture Fingerprint! Try Again\n"));
        }
        Serial.println(String(INFO) + String(":Please release your finger from the sensor\n"));
        while (fingerprint.detectFinger())
            ;
    }
    if (fingerprint.storeFingerprint(ID) != ERR_ID809)
    {
        Serial.println(String(GENERATE_PASSWORD) + String(":") + String(ID));
    }
    else
    {
        Serial.println(String(ERROR) + String(":Failed To Save Fingerprint! Try Again\n"));
    }
}

void deleteFingerprint()
{
    Serial.println(String(INFO) + String(":Confirm By Place Your Fingerprint To Deleted"));
    uint8_t ret = 0;
    if ((fingerprint.collectionFingerprint(5)) != ERR_ID809)
    {
        fingerprint.ctrlLED(fingerprint.eFastBlink, fingerprint.eLEDCyan, 3);
        while (fingerprint.detectFinger())
            ;
        ret = fingerprint.search();
        if (ret != 0)
        {
            int ID = ret;
            Serial.println(String(INFO) + String(":Processing... Don't Exit 🥶"));
            int startIndex = 2034;
            int previous = EEPROM.read(0);
            for (int i = 0; i < EEPROM.length(); i++)
            {
                if (i != 0)
                {
                    previous = EEPROM.read(i - 1);
                }
                int value = EEPROM.read(i);
                if (value == ID && previous == 124)
                {
                    startIndex = i;
                    break;
                }
            }
            if (startIndex != 2034)
            {
                int pointer = startIndex;
                while (EEPROM[pointer] != 124)
                {
                    pointer++;
                }
                int endIndex = ++pointer;
                while (pointer < EEPROM.length())
                {
                    EEPROM[startIndex++] = EEPROM[pointer++];
                    EEPROM[pointer - 1] = 0;
                }
                for (int i = startIndex; i < endIndex; i++)
                {
                    EEPROM[i] = 0;
                }
                fingerprint.delFingerprint(ID);
                Serial.println(String(SUCCESS) + String(":Successfully Deleted"));
            }
            else
            {
                fingerprint.delFingerprint(ID);
                Serial.println(String(SUCCESS) + String(":Successfully Deleted Fingerprint"));
                fingerprint.ctrlLED(fingerprint.eFastBlink, fingerprint.eLEDRed, 2);
            }
        }
        else
        {
            fingerprint.ctrlLED(fingerprint.eFastBlink, fingerprint.eLEDRed, 3);
            Serial.println(String(ERROR) + String(":Invalid Fingerprint Detected !!!"));
        }
    }
}

void addSmartlinking()
{
    fingerprint.ctrlLED(fingerprint.eBreathing, fingerprint.eLEDYellow, 0);
    uint8_t ret = 0;
    if ((fingerprint.collectionFingerprint(5)) != ERR_ID809)
    {
        fingerprint.ctrlLED(fingerprint.eFastBlink, fingerprint.eLEDCyan, 3);
        while (fingerprint.detectFinger())
            ;
        ret = fingerprint.search();
        if (ret != 0)
        {
            Serial.println(String("KEAX:") + String(DEVICE_ID) + String("|") + String(ret));
        }
        else
        {
            fingerprint.ctrlLED(fingerprint.eFastBlink, fingerprint.eLEDRed, 3);
        }
    }
}

void getSmartLinkPassword(String id)
{
    fingerprint.ctrlLED(fingerprint.eBreathing, fingerprint.eLEDYellow, 0);
    int fingerId = id.charAt(0) - '0';
    char Id = (char)fingerId;
    if ((fingerprint.collectionFingerprint(5)) != ERR_ID809)
    {
        fingerprint.ctrlLED(fingerprint.eFastBlink, fingerprint.eLEDCyan, 3);
        while (fingerprint.detectFinger())
            ;
        uint8_t ret = fingerprint.search();
        if (ret != 0)
        {
            readMemory(Id);
        }
        else
        {
            fingerprint.ctrlLED(fingerprint.eFastBlink, fingerprint.eLEDRed, 3);
        }
    }
}

void parseCommand(String command)
{
    int delimiterIndex = command.indexOf(':');
    String commandType = command.substring(0, delimiterIndex);
    String message = command.substring(delimiterIndex + 1);
    if (commandType == PING)
    {
        if (message == String(KRYPTON_AUTH))
        {
            Serial.println(String(PONG) + String(":VALIDATE"));
        }
        else
        {
            Serial.println(String(PONG) + String(":INVALIDATE"));
        }
    }
    else if (commandType == GET_DEVICE_ID)
    {
        Serial.println(String("KEGX:") + String(DEVICE_ID));
    }
    else if (commandType == GET_SMART_LINK_PASSWORD)
    {
        getSmartLinkPassword(message);
    }
    else if (commandType == TRANSMIT_PASSWORD)
    {
        storeInMemory(message);
    }
    else if (commandType == ADD_FINGERPRINT)
    {
        addFingerprint();
    }
    else if (commandType == COUNT_FINGERPRINTS)
    {
        Serial.println(String(SUCCESS) + String(":Total Registered Fingerprints are ") + String(fingerprint.getEnrollCount()));
    }
    else if (commandType == DELETE_FINGERPRINT)
    {
        deleteFingerprint();
    }
    else if (commandType == SMARTLINK_ADD)
    {
        addSmartlinking();
    }
    else
    {
        Serial.println(String(ERROR) + String(":Command Not Found"));
    }
}