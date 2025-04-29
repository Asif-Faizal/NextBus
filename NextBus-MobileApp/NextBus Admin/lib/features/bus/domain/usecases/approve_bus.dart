import 'package:dartz/dartz.dart';

import '../../data/models/bus_response_model.dart';
import '../bus_repo.dart';

class ApproveBusUsecase {
  final BusRepository repository;

  ApproveBusUsecase({required this.repository});

  Future<Either<Exception, BusModel>> call(String id) async {
    return repository.approveBus(id);
  }
}
