// Astryx(facebook/astryx, MIT)의 Checkout Form 패턴에서 착안 — 코드는 @sfood/ui 컴포넌트로 재구현
import { useState } from 'react'
import { Card } from '../../../components/data/Card'
import { Button } from '../../../components/foundation/Button'
import { FormField } from '../../../components/form/FormField'
import { Input } from '../../../components/form/Input'
import { Textarea } from '../../../components/form/Textarea'
import { Grid } from '../../../components/layout/Grid'

export interface CheckoutOrderItem {
  name: string
  qty: number
  price: number
}

export interface CheckoutFormProps {
  title?: string
  items: CheckoutOrderItem[]
  onSubmit?: (data: { name: string; phone: string; address: string; memo?: string }) => void
  onCancel?: () => void
}

export function CheckoutForm({ title = '주문 정보 입력', items, onSubmit, onCancel }: CheckoutFormProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [memo, setMemo] = useState('')

  const total = items.reduce((sum, item) => sum + item.qty * item.price, 0)

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-foreground mb-6">{title}</h2>
      <Grid cols={3} gap={6}>
        <div className="col-span-2 flex flex-col gap-4">
          <FormField label="수령인" required>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="수령인 이름" />
          </FormField>
          <FormField label="연락처" required>
            <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="010-0000-0000" />
          </FormField>
          <FormField label="배송 주소" required>
            <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="주소 입력" />
          </FormField>
          <FormField label="요청사항">
            <Textarea value={memo} onChange={e => setMemo(e.target.value)} placeholder="배송 시 요청사항 (선택)" rows={3} />
          </FormField>
        </div>
        <Card title="주문 요약">
          <div className="flex flex-col gap-2">
            {items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-foreground">{item.name} × {item.qty}</span>
                <span className="text-muted">{(item.qty * item.price).toLocaleString()}원</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-semibold text-foreground pt-3 mt-3 border-t border-border">
            <span>합계</span>
            <span>{total.toLocaleString()}원</span>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <Button
              disabled={!name || !phone || !address}
              onClick={() => onSubmit?.({ name, phone, address, memo: memo || undefined })}
            >
              결제하기
            </Button>
            <Button variant="secondary" onClick={onCancel}>취소</Button>
          </div>
        </Card>
      </Grid>
    </div>
  )
}
