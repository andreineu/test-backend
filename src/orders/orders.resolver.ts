import { Args, Query, Resolver } from '@nestjs/graphql'
import { RetailService } from '../retail_api/retail.service'
import { Order, OrdersResponse } from '../graphql'

@Resolver('Orders')
export class OrdersResolver {
  constructor(private retailService: RetailService) {}

  @Query('order')
  async order(@Args('id') id: string): Promise<Order | null> {
    return this.retailService.findOrder(id)
  }

  @Query('getOrders')
  async orders(@Args('page') page: number): Promise<OrdersResponse> {
    return this.retailService.orders({ page })
  }
}
