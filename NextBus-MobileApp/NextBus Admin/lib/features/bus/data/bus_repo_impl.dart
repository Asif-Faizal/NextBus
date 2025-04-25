import 'package:dartz/dartz.dart';

import '../domain/bus_repo.dart';
import 'bus_datasource.dart';
import 'bus_request_model.dart';
import 'bus_response_model.dart';

class BusRepositoryImpl implements BusRepository {
  final BusRemoteDataSource remoteDataSource;

  BusRepositoryImpl({required this.remoteDataSource});

  @override
  Future<Either<Exception, PaginatedBusResponse>> getBuses(BusRequestModel request) async {
    try {
      final result = await remoteDataSource.getBuses(request);
      return Right(result);
    } catch (e) {
      return Left(Exception('Failed to fetch buses'));
    }
  }
}