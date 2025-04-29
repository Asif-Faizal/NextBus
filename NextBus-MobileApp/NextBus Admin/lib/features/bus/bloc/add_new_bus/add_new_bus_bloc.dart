import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:next_bus_admin/features/bus/domain/bus_entity.dart';

import '../../data/models/add_bus_model.dart';
import '../../domain/usecases/add_bus.dart';

part 'add_new_bus_event.dart';
part 'add_new_bus_state.dart';

class AddNewBusBloc extends Bloc<AddNewBusEvent, AddNewBusState> {
  final AddBusUsecase addBusUsecase;
  AddNewBusBloc({required this.addBusUsecase}) : super(AddNewBusInitial()) {
    on<AddNewBus>((event, emit) async {
      emit(AddNewBusLoading());
      final result = await addBusUsecase(event.request);
      result.fold(
        (failure) => emit(AddNewBusFailure(failure.toString())),
        (success) => emit(AddNewBusSuccess(success)),
      );
    });
  }
}
