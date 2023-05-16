import { Injectable } from '@nestjs/common'
import { CrmType, Order, OrdersFilter, RetailPagination } from './types'
import axios, { AxiosInstance } from 'axios'
import { ConcurrencyManager } from 'axios-concurrency'
import { serialize } from '../tools'
import { plainToClass } from 'class-transformer'

const RETAIL_API_MAX_CONCURRENT_REQUESTS = 10

@Injectable()
export class RetailService {
  private readonly axios: AxiosInstance

  constructor() {
    this.axios = axios.create({
      baseURL: `${process.env.RETAIL_URL}/api/v5`,
      timeout: 10000,

      headers: { 'X-API-KEY': process.env.RETAIL_KEY },
    })

    ConcurrencyManager(this.axios, RETAIL_API_MAX_CONCURRENT_REQUESTS)
  }

  async orders(filter?: OrdersFilter) {
    const params = serialize(filter, '')
    const resp = await this.axios.get('/orders?' + params)

    if (!resp.data) throw new Error('RETAIL CRM ERROR')

    const orders = plainToClass(Order, resp.data.orders as Array<any>)
    const pagination: RetailPagination = resp.data.pagination

    return { orders, pagination }
  }

  async findOrder(id: string) {
    const resp = await this.axios.get('/orders/' + id, {
      params: { by: 'id' },
    })

    if (!resp.data) throw new Error('RETAIL CRM ERROR')

    const order = plainToClass(Order, resp.data.order)

    return order
  }

  async orderStatuses() {
    const resp = await this.axios.get('/reference/statuses')

    if (!resp.data) throw new Error('RETAIL CRM ERROR')

    const statuses = plainToClass(
      CrmType,
      Object.values(resp.data.statuses) as Array<any>,
    )

    return statuses
  }

  async productStatuses() {
    const resp = await this.axios.get('/reference/product-statuses')

    if (!resp.data) throw new Error('RETAIL CRM ERROR')

    const productStatuses = plainToClass(
      CrmType,
      Object.values(resp.data.productStatuses) as Array<any>,
    )

    return productStatuses
  }

  async deliveryTypes() {
    const resp = await this.axios.get('/reference/delivery-types')

    if (!resp.data) throw new Error('RETAIL CRM ERROR')

    const deliveryTypes = plainToClass(
      CrmType,
      Object.values(resp.data.deliveryTypes) as Array<any>,
    )

    return deliveryTypes
  }
}
