import 'package:dartz/dartz.dart';

import '../../data/models/bus_response_model.dart';
import '../bus_repo.dart';

class GetBusByIdUseCase {
  final BusRepository repository;

  GetBusByIdUseCase(this.repository);

  Future<Either<Exception, BusModel>> call(String id) {
    return repository.getBusById(id);
  }
}