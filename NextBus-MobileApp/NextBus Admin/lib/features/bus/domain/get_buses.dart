import 'package:dartz/dartz.dart';

import '../data/bus_request_model.dart';
import '../data/bus_response_model.dart';
import 'bus_repo.dart';

class GetBusesUseCase {
  final BusRepository repository;

  GetBusesUseCase(this.repository);

  Future<Either<Exception, PaginatedBusResponse>> call(BusRequestModel request) {
    return repository.getBuses(request);
  }
}