using Application.Models;
using System.Linq.Expressions;

namespace Application.Interfaces;
public interface IBaseRepository<TEntity> where TEntity : class
{
    Task<RepositoryResult> AddAsync(TEntity entity);
    Task<RepositoryResult<IEnumerable<TEntity>>> GetAllAsync();
    Task<RepositoryResult<TEntity?>> GetAsync(Expression<Func<TEntity, bool>> expression);
    Task<RepositoryResult> RemoveAsync(TEntity entity);
    Task<RepositoryResult> UpdateAsync(TEntity entity);
}