import 'package:dartz/dartz.dart';
import 'package:next_bus_admin/features/bus/data/models/add_bus_model.dart';

import '../../data/models/bus_response_model.dart';
import '../bus_repo.dart';

class EditBusUsecase {
  final BusRepository repository;

  EditBusUsecase({required this.repository});

  Future<Either<Exception, BusModel>> call(String id, AddBusModel request) async {
    return repository.editBus(id, request);
  }
}
