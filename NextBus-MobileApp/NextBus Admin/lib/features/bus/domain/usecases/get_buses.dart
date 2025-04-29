import 'package:dartz/dartz.dart';

import '../../data/models/bus_request_model.dart';
import '../../data/models/bus_response_model.dart';
import '../bus_repo.dart';

class GetBusesUseCase {
  final BusRepository repository;

  GetBusesUseCase(this.repository);

  Future<Either<Exception, PaginatedBusResponse>> call(BusListRequestModel request) {
    return repository.getBuses(request);
  }
}