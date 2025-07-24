import express from 'express';
import {
  getGenderSummary,
  getAgeSummary,
  getDeviceBrandSummary,
  getDigitalInterestSummary,
  getCustomers,
  getLocationTypeSummary,
  getLoginHourSummary
} from '../controllers/customer.controller';

const router = express.Router();

router.get('/summary/gender', getGenderSummary);
router.get('/summary/age', getAgeSummary);
router.get('/summary/device-brands', getDeviceBrandSummary);
router.get('/summary/digital-interests', getDigitalInterestSummary);
router.get('/summary/location-types', getLocationTypeSummary);
router.get('/summary/login-hours', getLoginHourSummary);
router.get('/', getCustomers);

export default router; 