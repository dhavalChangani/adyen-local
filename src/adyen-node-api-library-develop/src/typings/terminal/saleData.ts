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


import { SaleTerminalData } from './saleTerminalData';
import { SaleToAcquirerData } from './saleToAcquirerData';
import { SaleToIssuerData } from './saleToIssuerData';
import { SponsoredMerchant } from './sponsoredMerchant';
import { TransactionIdentification } from './transactionIdentification';

export class SaleData {
    'CustomerOrderID'?: string;
    'CustomerOrderReq'?: Array<SaleData.CustomerOrderReqEnum>;
    'OperatorID'?: string;
    'OperatorLanguage'?: string;
    'SaleReferenceID'?: string;
    'SaleTerminalData'?: SaleTerminalData;
    'SaleToAcquirerData'?: SaleToAcquirerData | string;
    'SaleToIssuerData'?: SaleToIssuerData;
    'SaleToPOIData'?: string;
    'SaleTransactionID': TransactionIdentification;
    'ShiftNumber'?: string;
    'SponsoredMerchant'?: Array<SponsoredMerchant>;
    'TokenRequestedType'?: SaleData.TokenRequestedTypeEnum;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "CustomerOrderID",
            "baseName": "CustomerOrderID",
            "type": "string"
        },
        {
            "name": "CustomerOrderReq",
            "baseName": "CustomerOrderReq",
            "type": "Array<SaleData.CustomerOrderReqEnum>"
        },
        {
            "name": "OperatorID",
            "baseName": "OperatorID",
            "type": "string"
        },
        {
            "name": "OperatorLanguage",
            "baseName": "OperatorLanguage",
            "type": "string"
        },
        {
            "name": "SaleReferenceID",
            "baseName": "SaleReferenceID",
            "type": "string"
        },
        {
            "name": "SaleTerminalData",
            "baseName": "SaleTerminalData",
            "type": "SaleTerminalData"
        },
        {
            "name": "SaleToAcquirerData",
            "baseName": "SaleToAcquirerData",
            "type": "SaleToAcquirerData"
        },
        {
            "name": "SaleToIssuerData",
            "baseName": "SaleToIssuerData",
            "type": "SaleToIssuerData"
        },
        {
            "name": "SaleToPOIData",
            "baseName": "SaleToPOIData",
            "type": "string"
        },
        {
            "name": "SaleTransactionID",
            "baseName": "SaleTransactionID",
            "type": "TransactionIdentification"
        },
        {
            "name": "ShiftNumber",
            "baseName": "ShiftNumber",
            "type": "string"
        },
        {
            "name": "SponsoredMerchant",
            "baseName": "SponsoredMerchant",
            "type": "Array<SponsoredMerchant>"
        },
        {
            "name": "TokenRequestedType",
            "baseName": "TokenRequestedType",
            "type": "SaleData.TokenRequestedTypeEnum"
        }    ];

    static getAttributeTypeMap() {
        return SaleData.attributeTypeMap;
    }
}

export namespace SaleData {
    export enum CustomerOrderReqEnum {
        Both = <any> 'Both',
        Closed = <any> 'Closed',
        Open = <any> 'Open'
    }
    export enum TokenRequestedTypeEnum {
        Customer = <any> 'Customer',
        Transaction = <any> 'Transaction'
    }
}
