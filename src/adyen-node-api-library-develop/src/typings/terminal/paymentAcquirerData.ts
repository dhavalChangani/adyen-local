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


import { TransactionIdentification } from './transactionIdentification';

export class PaymentAcquirerData {
    'AcquirerID'?: string;
    'AcquirerPOIID': string;
    'AcquirerTransactionID'?: TransactionIdentification;
    'ApprovalCode'?: string;
    'MerchantID': string;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "AcquirerID",
            "baseName": "AcquirerID",
            "type": "string"
        },
        {
            "name": "AcquirerPOIID",
            "baseName": "AcquirerPOIID",
            "type": "string"
        },
        {
            "name": "AcquirerTransactionID",
            "baseName": "AcquirerTransactionID",
            "type": "TransactionIdentification"
        },
        {
            "name": "ApprovalCode",
            "baseName": "ApprovalCode",
            "type": "string"
        },
        {
            "name": "MerchantID",
            "baseName": "MerchantID",
            "type": "string"
        }    ];

    static getAttributeTypeMap() {
        return PaymentAcquirerData.attributeTypeMap;
    }
}
