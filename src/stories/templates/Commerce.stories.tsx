import type { Meta, StoryObj } from '@storybook/react'
import { CheckoutForm } from '../../templates/service/commerce/CheckoutForm'

const meta: Meta = { title: 'Templates/Service/Commerce', parameters: { layout: 'fullscreen' } }
export default meta

export const Checkout: StoryObj = {
  render: () => (
    <CheckoutForm
      items={[
        { name: '쌀 (20kg)', qty: 2, price: 45000 },
        { name: '참기름 (500ml)', qty: 3, price: 12000 },
      ]}
      onSubmit={data => alert(JSON.stringify(data, null, 2))}
      onCancel={() => alert('취소')}
    />
  ),
}
