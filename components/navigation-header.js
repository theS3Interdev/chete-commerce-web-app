import { useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Store } from '../lib/store';

const NavigationHeader = () => {
	const { status, data: session } = useSession();
	const { state } = useContext(Store);
	const { cart } = state;
	const [cartItemsCount, setCartItemsCount] = useState(0);

	/** render the component when number of cart items change */
	useEffect(() => {
		setCartItemsCount(
			cart.cartItems.reduce(
				(previousValue, currentValue) => previousValue + currentValue.quantity,
				0
			)
		);
	}, [cart.cartItems]);

	return (
		<nav className="relative shadow-md">
			<div className="container mx-auto py-4">
				<div className="flex items-center justify-between px-4">
					{/** logo section start */}
					<Link href="/">
						<a className="text-2xl font-bold">chete men</a>
					</Link>
					{/** logo section end */}

					{/** navigation links start */}
					<div>
						<Link href="/cart">
							<a className="p-2">
								Cart
								{cartItemsCount > 0 && (
									<span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
										{cartItemsCount}
									</span>
								)}
							</a>
						</Link>

						{status === 'loading' ? (
							'Loading'
						) : session?.user ? (
							session.user.name
						) : (
							<Link href="/signin">
								<a className="p-2">Sign in</a>
							</Link>
						)}
					</div>
					{/** navigation links end */}
				</div>
			</div>
		</nav>
	);
};

export default NavigationHeader;
