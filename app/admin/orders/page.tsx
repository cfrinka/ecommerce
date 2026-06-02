import { getAllOrders, updateOrderStatusAction } from '../../actions/orders';

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl tracking-wide text-[#282828]">Orders</h2>

      <div className="rounded-sm border border-[#ddd] bg-[#faf9f7] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#f5f3f0]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-[#282828]/60 uppercase">Order</th>
              <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-[#282828]/60 uppercase">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-[#282828]/60 uppercase">Items</th>
              <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-[#282828]/60 uppercase">Total</th>
              <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-[#282828]/60 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-[#282828]/60 uppercase">Date</th>
              <th className="px-4 py-3 text-right text-xs font-semibold tracking-wider text-[#282828]/60 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ddd]">
            {orders.map((order: any) => (
              <tr key={order.id}>
                <td className="px-4 py-3 font-semibold text-[#282828]">#{order.id}</td>
                <td className="px-4 py-3">
                  <p className="text-[#282828]">{order.user_name}</p>
                  <p className="text-xs text-[#282828]/60">{order.user_email}</p>
                </td>
                <td className="px-4 py-3">
                  {order.items.map((item: any) => (
                    <p key={item.id} className="text-xs text-[#282828]/60">
                      {item.product_name} &times; {item.quantity} ({item.size})
                    </p>
                  ))}
                </td>
                <td className="px-4 py-3 font-semibold text-[#282828]">${(order.total / 100).toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold tracking-wider uppercase ${
                      order.status === 'delivered'
                        ? 'bg-[#355444]/10 text-[#355444]'
                        : order.status === 'shipped'
                        ? 'bg-[#2a5473]/10 text-[#2a5473]'
                        : order.status === 'cancelled'
                        ? 'bg-[#be1622]/10 text-[#be1622]'
                        : 'bg-[#ddd] text-[#282828]/60'
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-[#282828]/60">{new Date(order.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right">
                  <form action={updateOrderStatusAction.bind(null, order.id)} className="inline-flex items-center gap-2">
                    <select name="status" defaultValue={order.status} className="rounded-sm border border-[#ddd] bg-[#f5f3f0] px-2 py-1 text-xs text-[#282828]">
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <button type="submit" className="text-xs font-semibold text-[#282828] transition hover:text-[#be1622]">
                      UPDATE
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
