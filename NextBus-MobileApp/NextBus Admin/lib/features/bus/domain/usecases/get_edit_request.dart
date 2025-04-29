import 'package:dartz/dartz.dart';

import '../../data/models/add_bus_model.dart';
import '../bus_repo.dart';

class GetEditRequestUsecase {
  final BusRepository repository;

  GetEditRequestUsecase({required this.repository});

  Future<Either<Exception, AddBusModel>> call(String id) async {
    return await repository.getEditRequest(id);
  }
} 