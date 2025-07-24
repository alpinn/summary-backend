import { Request, Response } from 'express';
import Customer from '../models/Customer';

export const getGenderSummary = async (req: Request, res: Response) => {
  try {
    const genderSummary = await Customer.aggregate([
      {
        $group: {
          _id: '$gender',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    res.json(genderSummary);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching gender summary', error });
  }
};

export const getAgeSummary = async (req: Request, res: Response) => {
  try {
    const currentYear = new Date().getFullYear();
    const ageSummary = await Customer.aggregate([
      {
        $addFields: {
          calculatedAge: { $subtract: [currentYear, '$age'] }
        }
      },
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $lte: ['$calculatedAge', 20] }, then: '0-20' },
                { case: { $lte: ['$calculatedAge', 30] }, then: '21-30' },
                { case: { $lte: ['$calculatedAge', 40] }, then: '31-40' },
                { case: { $lte: ['$calculatedAge', 50] }, then: '41-50' },
                { case: { $lte: ['$calculatedAge', 60] }, then: '51-60' }
              ],
              default: '60+'
            }
          },
          count: { $sum: 1 },
          avgAge: { $avg: '$calculatedAge' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);
    res.json(ageSummary);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching age summary', error });
  }
};

export const getDeviceBrandSummary = async (req: Request, res: Response) => {
  try {
    const deviceSummary = await Customer.aggregate([
      {
        $group: {
          _id: '$brandDevice',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    res.json(deviceSummary);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching device summary', error });
  }
};

export const getDigitalInterestSummary = async (req: Request, res: Response) => {
  try {
    const interestSummary = await Customer.aggregate([
      {
        $group: {
          _id: '$digitalInterest',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    res.json(interestSummary);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching digital interest summary', error });
  }
};

export const getLoginHourSummary = async (req: Request, res: Response) => {
  try {
    const loginHourSummary = await Customer.aggregate([
      {
        $addFields: {
          hour: {
            $toInt: {
              $arrayElemAt: [
                { $split: ["$loginHour", ":"] },
                0
              ]
            }
          }
        }
      },
      {
        $group: {
          _id: "$hour",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          hour: "$_id",
          count: 1,
          timeRange: {
            $concat: [
              { $toString: "$_id" },
              ":00 - ",
              { $toString: { $add: ["$_id", 1] } },
              ":00"
            ]
          }
        }
      },
      {
        $sort: { hour: 1 }
      }
    ]);

    const totalVisits = loginHourSummary.reduce((sum, hour) => sum + hour.count, 0);
    const peakHours = loginHourSummary
      .map(hour => ({
        ...hour,
        percentage: ((hour.count / totalVisits) * 100).toFixed(2)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    res.json({
      hourly_distribution: loginHourSummary,
      peak_hours: peakHours,
      total_visits: totalVisits
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching login hour summary', error });
  }
};

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 100;
    const skip = (page - 1) * limit;

    const [customers, total] = await Promise.all([
      Customer.find()
        .select('number nameOfLocation date loginHour name age gender email phone brandDevice digitalInterest locationType')
        .sort({ number: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Customer.countDocuments()
    ]);

    res.json({
      data: customers,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
        limit,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers', error });
  }
};

export const getLocationTypeSummary = async (req: Request, res: Response) => {
  try {
    const locationSummary = await Customer.aggregate([
      {
        $group: {
          _id: '$locationType',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    res.json(locationSummary);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching location type summary', error });
  }
};

