import 'package:dartz/dartz.dart';

import '../../data/models/add_bus_model.dart';
import '../../data/models/bus_response_model.dart';
import '../bus_repo.dart';

class AddBusUsecase {
  final BusRepository repository;

  AddBusUsecase({required this.repository});

  Future<Either<Exception, BusModel>> call(AddBusModel request) async {
    return repository.addBus(request);
  }
}
