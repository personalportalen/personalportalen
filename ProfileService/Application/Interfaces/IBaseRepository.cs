using System.Linq.Expressions;

namespace Application.Interfaces;
public interface IBaseRepository<TEntity> where TEntity : class
{
    Task AddAsync(TEntity entity);
    Task DeleteAsync(TEntity entity);
    Task<IEnumerable<TEntity>> GetAllAsync();
    Task<TEntity?> GetAsync(Expression<Func<TEntity, bool>> expression);
    Task UpdateAsync(TEntity entity);
    Task SaveAsync();
}