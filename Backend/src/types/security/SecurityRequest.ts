import SecurityData from "./SecurityData";
import express from 'express';

export default interface SecurityRequest extends express.Request{
    securityData: SecurityData;
}