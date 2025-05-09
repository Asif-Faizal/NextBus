import 'package:dartz/dartz.dart';

import '../data/models/add_bus_model.dart';
import '../data/models/bus_request_model.dart';
import '../data/models/bus_response_model.dart';

abstract class BusRepository {
  Future<Either<Exception, PaginatedBusResponse>> getBuses(BusListRequestModel request);
  Future<Either<Exception, BusModel>> getBusById(String id);
  Future<Either<Exception, BusModel>> addBus(AddBusModel request);
  Future<Either<Exception, BusModel>> approveBus(String id);
  Future<Either<Exception, BusModel>> editBus(String id, AddBusModel request);
  Future<Either<Exception, AddBusModel>> getEditRequest(String id);
  Future<Either<Exception, BusModel>> approveEditRequest(String id);
  Future<Either<Exception, BusModel>> rejectApproval(String id);
  Future<Either<Exception, BusModel>> deleteBus(String id);
  Future<Either<Exception, String>> approveDelete(String id);
}