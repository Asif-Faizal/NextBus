import 'package:dartz/dartz.dart';

import '../data/models/add_bus_model.dart';
import '../data/models/bus_request_model.dart';
import '../data/models/bus_response_model.dart';

abstract class BusRepository {
  Future<Either<Exception, PaginatedBusResponse>> getBuses(BusListRequestModel request);
  Future<Either<Exception, BusModel>> getBusById(String id);
  Future<Either<Exception, BusModel>> addBus(AddBusModel request);
  Future<Either<Exception, BusModel>> approveBus(String id);
}