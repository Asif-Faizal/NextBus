import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';

import '../../data/models/add_bus_model.dart';
import '../../domain/usecases/get_edit_request.dart';

part 'get_edit_request_event.dart';
part 'get_edit_request_state.dart';

class GetEditRequestBloc extends Bloc<GetEditRequestEvent, GetEditRequestState> {
  final GetEditRequestUsecase getEditRequest;

  GetEditRequestBloc({required this.getEditRequest}) : super(GetEditRequestInitial()) {
    on<FetchEditRequest>(_onFetchEditRequest);
  }

  Future<void> _onFetchEditRequest(
    FetchEditRequest event,
    Emitter<GetEditRequestState> emit,
  ) async {
    emit(GetEditRequestLoading());
    try {
      final result = await getEditRequest(event.id);
      result.fold(
        (failure) => emit(GetEditRequestError(failure.toString())),
        (editRequest) => emit(GetEditRequestLoaded(editRequest)),
      );
    } catch (e) {
      emit(GetEditRequestError(e.toString()));
    }
  }
} 