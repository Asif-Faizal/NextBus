import 'package:dartz/dartz.dart';

import '../bus_entity.dart';
import '../bus_repo.dart';

class DeleteBusUsecase {
  final BusRepository busRepository;

  DeleteBusUsecase({required this.busRepository});

  Future<Either<Exception, BusEntity>> call(String id) async {
    return busRepository.deleteBus(id);
  }
}
