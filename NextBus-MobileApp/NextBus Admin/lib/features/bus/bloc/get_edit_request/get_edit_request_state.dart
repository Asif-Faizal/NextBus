part of 'get_edit_request_bloc.dart';

abstract class GetEditRequestState extends Equatable {
  const GetEditRequestState();

  @override
  List<Object> get props => [];
}

class GetEditRequestInitial extends GetEditRequestState {}

class GetEditRequestLoading extends GetEditRequestState {}

class GetEditRequestLoaded extends GetEditRequestState {
  final AddBusModel editRequest;

  const GetEditRequestLoaded(this.editRequest);

  @override
  List<Object> get props => [editRequest];
}

class GetEditRequestError extends GetEditRequestState {
  final String message;

  const GetEditRequestError(this.message);

  @override
  List<Object> get props => [message];
}