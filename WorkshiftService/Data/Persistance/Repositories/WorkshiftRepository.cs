using Domain.Entities;
using Application.Interfaces;
using Infrastructure.Persistance.Context;

namespace Infrastructure.Persistance.Repositories;
public class WorkshiftRepository(DataContext context) : BaseRepository<WorkshiftEntity>(context), IWorkshiftRepository
{

}
