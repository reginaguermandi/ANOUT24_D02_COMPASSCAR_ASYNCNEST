import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from '../../src/order/repository/order.controller';
import { OrderService } from '../../src/order/repository/order.service';
import { PrismaService } from 'src/prisma/prisma.service';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { mockPrismaService } from './mock-prisma.service';
import { axiosMock } from './mock-axios';
import axios from 'axios';

jest.mock('axios');

describe('OrderController (E2E)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        OrderService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    })
      .overrideProvider(axios)
      .useValue(axiosMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create an order successfully', async () => {
    const createOrderDto = {
      clientId: 1,
      carId: 1,
      startDate: new Date(),
      endDate: new Date(),
      cep: '01310-930',
    };

    axiosMock.get.mockResolvedValue({
      data: {
        localidade: 'São Paulo',
        uf: 'SP',
        gia: '1004',
      },
    });

    mockPrismaService.car.findUnique.mockResolvedValue({
      id: 1,
      dailyPrice: 100,
      status: true,
    });

    mockPrismaService.client.findUnique.mockResolvedValue({
      id: 1,
      status: true,
    });

    mockPrismaService.order.create.mockResolvedValue({
      id: 1,
      ...createOrderDto,
      rentalFee: 10.04,
      totalAmount: 10.04,
      statusOrder: 'open',
    });

    return request(app.getHttpServer())
      .post('/orders')
      .send(createOrderDto)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.statusOrder).toBe('open');
      });
  })

  it('should fail when creating order with invalid CEP', async () => {
    const createOrderDto = {
      clientId: 1,
      carId: 1,
      startDate: new Date(),
      endDate: new Date(),
      cep: '01310-930',
    };

    axiosMock.get.mockResolvedValue({ data: { erro: true } });

    return request(app.getHttpServer())
      .post('/orders')
      .send(createOrderDto)
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toBe(
          'Error while fetching address from VIACEP',
        );
      });
  });

  it('should fail when car is not available', async () => {
    const createOrderDto = {
      clientId: 1,
      carId: 1,
      startDate: new Date(),
      endDate: new Date(),
      cep: '01310-930',
    };

    axiosMock.get.mockResolvedValue({
      data: {
        localidade: 'São Paulo',
        uf: 'SP',
        gia: '1004',
      },
    });

    mockPrismaService.car.findUnique.mockResolvedValue({
      id: 1,
      status: false,
    });

    return request(app.getHttpServer())
      .post('/orders')
      .send(createOrderDto)
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toBe('Car is not active.');
      });
  });
});
