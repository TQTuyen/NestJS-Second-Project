import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  AUTH_PACKAGE_NAME,
  AUTH_SERVICE_NAME,
  AuthServiceClient,
  LoggerModule,
} from '@app/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { ClientGrpc, ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { createAuthContext } from './auth.context';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule,
    GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      useFactory: (configService: ConfigService, client: ClientGrpc) => {
        const authService =
          client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);

        return {
          server: {
            context: createAuthContext(authService),
          },
          gateway: {
            supergraphSdl: new IntrospectAndCompose({
              subgraphs: [
                {
                  name: 'reservations',
                  url: configService.getOrThrow('RESERVATIONS_GRAPHQL_URL'),
                },
              ],
            }),
            buildService({ url }) {
              return new RemoteGraphQLDataSource({
                url,
                willSendRequest({ request, context }) {
                  request.http?.headers.set(
                    'user',
                    context?.user ? JSON.stringify(context.user) : '',
                  );
                },
              });
            },
          },
        };
      },
      inject: [ConfigService, AUTH_SERVICE_NAME],
    }),
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE_NAME,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: AUTH_PACKAGE_NAME,
            protoPath: join(__dirname, '../../../proto/auth.proto'),
            url: configService.getOrThrow('AUTH_GRPC_URL'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class GatewayModule {}
