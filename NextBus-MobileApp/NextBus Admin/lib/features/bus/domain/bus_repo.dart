import 'package:dartz/dartz.dart';

import '../data/bus_request_model.dart';
import '../data/bus_response_model.dart';

abstract class BusRepository {
  Future<Either<Exception, PaginatedBusResponse>> getBuses(BusRequestModel request);
}