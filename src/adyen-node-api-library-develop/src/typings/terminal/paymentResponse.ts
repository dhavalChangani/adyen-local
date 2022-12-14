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


import { CustomerOrder } from './customerOrder';
import { LoyaltyResult } from './loyaltyResult';
import { POIData } from './pOIData';
import { PaymentReceipt } from './paymentReceipt';
import { PaymentResult } from './paymentResult';
import { Response } from './response';
import { SaleData } from './saleData';

export class PaymentResponse {
    'CustomerOrder'?: Array<CustomerOrder>;
    'LoyaltyResult'?: Array<LoyaltyResult>;
    'PaymentReceipt'?: Array<PaymentReceipt>;
    'PaymentResult'?: PaymentResult;
    'POIData': POIData;
    'Response': Response;
    'SaleData': SaleData;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "CustomerOrder",
            "baseName": "CustomerOrder",
            "type": "Array<CustomerOrder>"
        },
        {
            "name": "LoyaltyResult",
            "baseName": "LoyaltyResult",
            "type": "Array<LoyaltyResult>"
        },
        {
            "name": "PaymentReceipt",
            "baseName": "PaymentReceipt",
            "type": "Array<PaymentReceipt>"
        },
        {
            "name": "PaymentResult",
            "baseName": "PaymentResult",
            "type": "PaymentResult"
        },
        {
            "name": "POIData",
            "baseName": "POIData",
            "type": "POIData"
        },
        {
            "name": "Response",
            "baseName": "Response",
            "type": "Response"
        },
        {
            "name": "SaleData",
            "baseName": "SaleData",
            "type": "SaleData"
        }    ];

    static getAttributeTypeMap() {
        return PaymentResponse.attributeTypeMap;
    }
}

