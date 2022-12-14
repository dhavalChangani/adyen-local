/*
 *                       ######
 *                       ######
 * ############    ####( ######  #####. ######  ############   ############
 * #############  #####( ######  #####. ######  #############  #############
 *        ######  #####( ######  #####. ######  #####  ######  #####  ######
 * ###### ######  #####( ######  #####. ######  #####  #####   #####  ######
 * ###### ######  #####( ######  #####. ######  #####          #####  ######
 * #############  #############  #############  #############  #####  ######
 *  ############   ############  #############   ############  #####  ######
 *                                      ######
 *                               #############
 *                               ############
 * Adyen NodeJS API Library
 * Copyright (c) 2021 Adyen B.V.
 * This file is open source and available under the MIT license.
 * See the LICENSE file for more info.
 */
 
/**
 * Terminal API
 * Definition of Terminal API Schema
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */



export class SoundContent {
    'Language'?: string;
    'ReferenceID'?: string;
    'SoundFormat'?: SoundContent.SoundFormatEnum;
    'Value'?: string;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "Language",
            "baseName": "Language",
            "type": "string"
        },
        {
            "name": "ReferenceID",
            "baseName": "ReferenceID",
            "type": "string"
        },
        {
            "name": "SoundFormat",
            "baseName": "SoundFormat",
            "type": "SoundContent.SoundFormatEnum"
        },
        {
            "name": "Value",
            "baseName": "Value",
            "type": "string"
        }    ];

    static getAttributeTypeMap() {
        return SoundContent.attributeTypeMap;
    }
}

export namespace SoundContent {
    export enum SoundFormatEnum {
        MessageRef = <any> 'MessageRef',
        SoundRef = <any> 'SoundRef',
        Text = <any> 'Text'
    }
}
