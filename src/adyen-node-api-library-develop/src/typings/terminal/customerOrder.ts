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



export class CustomerOrder {
    'AccessedBy'?: string;
    'AdditionalInformation'?: string;
    'Currency'?: string;
    'CurrentAmount': number;
    'CustomerOrderID': string;
    'EndDate'?: { [key: string]: any; };
    'ForecastedAmount': number;
    'OpenOrderState'?: boolean;
    'StartDate': { [key: string]: any; };

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "AccessedBy",
            "baseName": "AccessedBy",
            "type": "string"
        },
        {
            "name": "AdditionalInformation",
            "baseName": "AdditionalInformation",
            "type": "string"
        },
        {
            "name": "Currency",
            "baseName": "Currency",
            "type": "string"
        },
        {
            "name": "CurrentAmount",
            "baseName": "CurrentAmount",
            "type": "number"
        },
        {
            "name": "CustomerOrderID",
            "baseName": "CustomerOrderID",
            "type": "string"
        },
        {
            "name": "EndDate",
            "baseName": "EndDate",
            "type": "{ [key: string]: any; }"
        },
        {
            "name": "ForecastedAmount",
            "baseName": "ForecastedAmount",
            "type": "number"
        },
        {
            "name": "OpenOrderState",
            "baseName": "OpenOrderState",
            "type": "boolean"
        },
        {
            "name": "StartDate",
            "baseName": "StartDate",
            "type": "{ [key: string]: any; }"
        }    ];

    static getAttributeTypeMap() {
        return CustomerOrder.attributeTypeMap;
    }
}
