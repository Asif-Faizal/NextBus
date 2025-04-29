import 'package:dartz/dartz.dart';

import '../domain/bus_repo.dart';
import 'models/add_bus_model.dart';
import 'bus_datasource.dart';
import 'models/bus_request_model.dart';
import 'models/bus_response_model.dart';

class BusRepositoryImpl implements BusRepository {
  final BusRemoteDataSource remoteDataSource;

  BusRepositoryImpl({required this.remoteDataSource});

  @override
  Future<Either<Exception, PaginatedBusResponse>> getBuses(BusListRequestModel request) async {
    try {
      final result = await remoteDataSource.getBuses(request);
      return Right(result);
    } catch (e) {
      return Left(Exception('Failed to fetch buses'));
    }
  }

  @override
  Future<Either<Exception, BusModel>> getBusById(String id) async {
    try {
      final result = await remoteDataSource.getBusById(id);
      return Right(result);
    } catch (e) {
      return Left(Exception('Failed to fetch bus by id'));
    }
  }

  @override
  Future<Either<Exception, BusModel>> addBus(AddBusModel request) async {
    try {
      final result = await remoteDataSource.addBus(request);
      return Right(result);
    } catch (e) {
      return Left(Exception('Failed to add bus'));
    }
  }

  @override
  Future<Either<Exception, BusModel>> approveBus(String id) async {
    try {
      final result = await remoteDataSource.approveBus(id);
      return Right(result);
    } catch (e) {
      return Left(Exception(e.toString()));
    }
  }

  @override
  Future<Either<Exception, BusModel>> editBus(String id, AddBusModel request) async {
    try {
      final result = await remoteDataSource.editBus(id, request);
      return Right(result);
    } catch (e) {
      return Left(Exception(e.toString()));
    }
  }

  @override
  Future<Either<Exception, AddBusModel>> getEditRequest(String id) async {
    try {
      final result = await remoteDataSource.getEditRequest(id);
      return Right(result);
    } catch (e) {
      return Left(Exception(e.toString()));
    }
  }

  @override
  Future<Either<Exception, BusModel>> approveEditRequest(String id) async {
    try {
      final result = await remoteDataSource.approveEditRequest(id);
      return Right(result);
    } catch (e) {
      return Left(Exception(e.toString()));
    }
  }

  @override
  Future<Either<Exception, BusModel>> rejectApproval(String id) async {
    try {
      final result = await remoteDataSource.rejectApproval(id);
      return Right(result);
    } catch (e) {
      return Left(Exception(e.toString()));
    }
  }

  @override
  Future<Either<Exception, BusModel>> deleteBus(String id) async {
    try {
      final result = await remoteDataSource.deleteBus(id);
      return Right(result);
    } catch (e) {
      return Left(Exception(e.toString()));
    }
  }
}
