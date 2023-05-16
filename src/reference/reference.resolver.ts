import { Query, Resolver } from '@nestjs/graphql'
import { RetailService } from '../retail_api/retail.service'
import { DeliveryType, OrderStatus, ProductStatus } from '../graphql'

@Resolver('Reference')
export class ReferenceResolver {
  constructor(private retailService: RetailService) {}

  @Query('deliveryTypes')
  async deliveryTypes(): Promise<DeliveryType[]> {
    return this.retailService.deliveryTypes()
  }

  @Query('productStatuses')
  async productStatuses(): Promise<ProductStatus[]> {
    return this.retailService.productStatuses()
  }

  @Query('orderStatuses')
  async orderStatusexs(): Promise<OrderStatus[]> {
    return this.retailService.orderStatuses()
  }
}
