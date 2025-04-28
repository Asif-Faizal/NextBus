import 'package:dartz/dartz.dart';

import '../data/add_bus_model.dart';
import '../data/bus_request_model.dart';
import '../data/bus_response_model.dart';

abstract class BusRepository {
  Future<Either<Exception, PaginatedBusResponse>> getBuses(BusListRequestModel request);
  Future<Either<Exception, BusModel>> getBusById(String id);
  Future<Either<Exception, BusModel>> addBus(AddBusModel request);
}