import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';

import '../../data/models/add_bus_model.dart';
import '../../data/models/bus_response_model.dart';
import '../../domain/usecases/edit_bus.dart';

part 'edit_bus_event.dart';
part 'edit_bus_state.dart';

class EditBusBloc extends Bloc<EditBusEvent, EditBusState> {
  final EditBusUsecase editBusUsecase;
  EditBusBloc({required this.editBusUsecase}) : super(EditBusInitial()) {
    on<EditBusEvent>((event, emit) async {
      if (event is EditBus) {
        emit(EditBusLoading());
        final result = await editBusUsecase.call(event.id, event.request);
        result.fold(
          (failure) => emit(EditBusError(failure.toString())),
          (bus) => emit(EditBusLoaded(bus)),
        );
      }
    });
  }
}
