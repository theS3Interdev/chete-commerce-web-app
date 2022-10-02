import { getSession } from 'next-auth/react';
import Order from '../../../models/order';
import Product from '../../../models/product';
import User from '../../../models/user';
import db from '../../../lib/db';

const handler = async (req, res) => {
	const session = await getSession({ req });

	console.log(session);

	if (!session || (session && !session.user.isAdmin)) {
		return res.status(401).send('signin required');
	}

	await db.connect();

	const ordersCount = await Order.countDocuments();
	const productsCount = await Product.countDocuments();
	const usersCount = await User.countDocuments();

	const ordersPriceGroup = await Order.aggregate([
		{
			$group: {
				_id: null,
				sales: { $sum: '$totalCost' },
			},
		},
	]);

	const ordersPrice = ordersPriceGroup.length > 0 ? ordersPriceGroup[0].sales : 0;

	const salesData = await Order.aggregate([
		{
			$group: {
				_id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
				totalSales: { $sum: '$totalCost' },
			},
		},
	]);

	await db.disconnect();

	res.send({ ordersCount, productsCount, usersCount, ordersPrice, salesData });
};

export default handler;