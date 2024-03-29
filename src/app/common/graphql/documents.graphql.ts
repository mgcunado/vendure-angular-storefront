import {gql} from 'apollo-angular';


// import { ADDRESS_FRAGMENT, ASSET_FRAGMENT, COUNTRY_FRAGMENT } from './fragments.graphql';
import { ADDRESS_FRAGMENT, ASSET_FRAGMENT, COUNTRY_FRAGMENT, PROVINCE_FRAGMENT } from './fragments.graphql';

export const GET_CUSTOMER_ADDRESSES = gql`
    query GetCustomerAddresses {
        activeCustomer {
            id
            addresses {
                ...Address
            }
        }
    }
    ${ADDRESS_FRAGMENT}
`;

export const GET_AVAILABLE_COUNTRIES = gql`
    query GetAvailableCountries {
        availableCountries {
            ...Country
        }
    }
    ${COUNTRY_FRAGMENT}
`;

export const GET_AVAILABLE_PROVINCES = gql`
    query GetAvailableProvinces($countryId: ID!) {
        availableProvinces(countryId: $countryId) {
            ...Province
        }
    }
    ${PROVINCE_FRAGMENT}
`;

export const GET_PROVINCE_BY_CODE = gql`
    query GetProvinceByCode($countryId: ID!, $code: String!) {
        provinceByCode(countryId: $countryId, code: $code) {
            ...Province
        }
    }
    ${PROVINCE_FRAGMENT}
`;

export const GET_ACTIVE_CUSTOMER = gql`
    query GetActiveCustomer {
        activeCustomer {
            id
            firstName
            lastName
            emailAddress
            phoneNumber
        }
    }
`;
export const GET_COLLECTIONS = gql`
    query GetCollections($options: CollectionListOptions) {
        collections(options: $options) {
            items {
                id
                name
                slug
                parent {
                    id
                    name
                    slug
                }
                featuredAsset {
                    ...Asset
                }
            }
        }
    }
    ${ASSET_FRAGMENT}
`;
